import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
import { ExifImage } from "exif";
import { defaults } from "request"
import axios from 'axios'
import * as util from 'util'
import { json } from 'express'

@Injectable()
export class PublicationsService {
  constructor (
    @InjectModel(Publication.name)
    private publicationModel: Model<PublicationDocument>
  ) {}

  async findAll (): Promise<Publication[]> {
    this.getExif('https://github.com/ianare/exif-samples/blob/master/jpg/tests/22-canon_tags.jpg?raw=true')
    return this.publicationModel.find().exec()
  }

  async findAllByTag (tag: string): Promise<Publication[]> {
    const totalCount = await this.publicationModel.find().countDocuments()
    return this.publicationModel.aggregate([
      { $sample: { size: totalCount } },
      { $match: { tags: tag } },
      { $project: { imageLink: 1, rank: 1 } }
    ])
  }

  async findAllByPseudo (pseudo: string): Promise<Publication[]> {
    return this.publicationModel.find(
      {
        pseudo: pseudo
      },
      {
        imageLink: 1,
        rank: 1
      }
    ).exec()
  }

  async findAllByArrayOfId (ids: Array<string>): Promise<Publication[]> {
    return this.publicationModel.find(
      {
        _id:
          {
            $in: ids
          }
      },
      { imageLink: 1, rank: 1 }
    ).exec()
  }

  async findOne (id: string): Promise<Publication> {
    return this.publicationModel.findOne({ _id: id })
  }

  async create (createPostDto: CreatePublicationDto): Promise<Publication> {
    const createdPost = new this.publicationModel(createPostDto)

    if (!createdPost.tags || createdPost.tags.length === 0) {
      throw new HttpException(
        util.format('The publication %s doesn\'t have any tags', createdPost.id),
        HttpStatus.FORBIDDEN
      )
    }
    console.log(this.getExif(createdPost.imageLink))
    const exif = this.getExif(createdPost.imageLink)
    if (exif !== undefined) {
      createdPost.metaDatas = exif
    } else {
      createdPost.metaDatas = {}
      console.log("No exif for this image")
    }

    const date = new Date();
    const dateString = date.toDateString() + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    createdPost.date = dateString;
    createdPost.nbVotes = 0;
    createdPost.rank = 0;
    createdPost.points = 0;

    if(createdPost.imageLink.indexOf('default') === -1) {
      const newImageLink = createPostDto.pseudo + '_' + dateString.replace(/[ :]/g, '_');
      createdPost.imageLink = await this.renameImageLink(createdPost.imageLink, newImageLink);
    }

    return createdPost.save()
  }

  async renameImageLink (actualName: string, newName: string): Promise<string> {
    return axios.put(process.env.CLOUD_URL, { actualName: actualName, newName: newName})
    .then((response) => {
      return response.data;
    }).catch((error) => {
      console.log(error);
      return '';
    });
  }

  async remove (id: string, pseudoUserConnected: string, token: string) : Promise<boolean> {
    const publication = await this.findOne(id);
    if (!publication) {
      return false;
    }

    const isVerified = await this.verifyUserAndToken(publication.pseudo, pseudoUserConnected, token);
    if(!isVerified) {
      return false;
    }

    axios.delete(process.env.CLOUD_URL, { data : { url: publication.imageLink, token: token } });

    const res = await this.publicationModel.deleteOne({ _id: id })

    if (res.ok === 0 || res.n === 0) {
      return false
    }
    return true
  }

  async getExif (urlImage) {
    let exif = undefined
    const request = defaults({ encoding: null });
    request.get(urlImage, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          // eslint-disable-next-line no-new
          new ExifImage({ image: body }, function (error, exifData) {
            if (!error) {
              console.log(typeof exifData)
              console.log(exifData); // Do something with your data!
              exif = exifData
            } else {
              console.log('Error: ' + error.message);
            }
          });
        } catch (error) {
          console.log('Error: ' + error.message);
        }
      }
    });
    return exif
  }

  /*    getNextSequenceValue () {
    const sequenceDocument = this.userModel.estimatedDocumentCount();
    console.log("NB DOCUMENT" + sequenceDocument.getQuery()._id);
    return sequenceDocument.getQuery();
  } */
  async removeAllFromUser(pseudo: string, pseudoUserConnected: string, token: string) : Promise<boolean> {
    const isVerified = await this.verifyUserAndToken(pseudo, pseudoUserConnected, token);
    if(!isVerified) {
      return false;
    }

    const publications = await this.publicationModel.find({ pseudo: pseudo },{ _id: 1 }).exec();
    for(let i = 0; i < publications.length; i++) {
      await this.remove(publications[i]._id, pseudoUserConnected, token);
    }

    console.log('All publications of %s have been deleted !', pseudo);
    return true
  }

  async verifyUserAndToken (pseudo: string, pseudoUserConnected: string, token: string) {
    if(token !== 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2') {
      return false;
    }

    const user = await axios.get(process.env.SERVER_URL + 'users/' + pseudoUserConnected).then((response) => response.data);
    if (!user.isAdmin && pseudo !== pseudoUserConnected) {
      return false;
    }
    return true;
  }
}
