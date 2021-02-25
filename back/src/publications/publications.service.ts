import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
import axios from 'axios'
import * as util from 'util'

@Injectable()
export class PublicationsService {
  constructor (
    @InjectModel(Publication.name)
    private publicationModel: Model<PublicationDocument>
  ) {}

  CLOUD_URL: string = 'http://89.158.244.191:17001/images';

  async findAll (): Promise<Publication[]> {
    return this.publicationModel.find().exec()
  }

  async findAllByTag (tag: string): Promise<Publication[]> {
    const totalCount = await this.publicationModel.find().countDocuments();
    return this.publicationModel.aggregate([
      { $sample: { size: totalCount } },
      { $match:  {"tags": tag} },
      { $project: { imageLink: 1, rank: 1} }
    ]);
  }

  async findAllByPseudo (pseudo: string): Promise<Publication[]> {
    return this.publicationModel.find(
      {
        "pseudo": pseudo
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
            $in : ids
          }
      },
      { imageLink: 1, rank: 1}
    ).exec()
  }

  async findOne (id: string): Promise<Publication> {
    return await this.publicationModel.findOne({ id: id })
  }

  async create (createPostDto: CreatePublicationDto): Promise<Publication> {
    const createdPost = new this.publicationModel(createPostDto)

    if(!createdPost.tags || createdPost.tags.length === 0) {
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
    return axios.put(this.CLOUD_URL, { actualName: actualName, newName: newName})
    .then((response) => {
      return response.data;
    }).catch((error) => {
      console.log(error);
      return '';
    });
  }

  async remove (id: number) {
    const res = await this.publicationModel.deleteOne({ id: id })
    if (res.result.ok === 1 && res.result.n === 1) {
      return {
        status: 204,
        message: util.format(
          'Publication with the id %s successfully deleted',
          id
        )
      }
    }
    return {
      status: 404,
      message: util.format(
        'An error occured when trying to remove the publication with the id : %s ',
        id
      )
    }
  }

  /*    getNextSequenceValue () {
    const sequenceDocument = this.userModel.estimatedDocumentCount();
    console.log("NB DOCUMENT" + sequenceDocument.getQuery()._id);
    return sequenceDocument.getQuery();
  } */
}
