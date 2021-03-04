import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
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
