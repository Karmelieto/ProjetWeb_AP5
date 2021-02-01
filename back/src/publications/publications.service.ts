import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
import * as util from 'util'

@Injectable()
export class PublicationsService {
  constructor (
    @InjectModel(Publication.name)
    private publicationModel: Model<PublicationDocument>
  ) {}

  private readonly logger = new Logger(PublicationsService.name);

  async findAll (): Promise<Publication[]> {
    return this.publicationModel.find().exec()
  }

  async findOne (id: number): Promise<Publication> {
    const publication: Publication = await this.publicationModel.findOne({
      id: id
    })
    if (publication) {
      return publication
    } else {
      throw new HttpException(
        util.format('The publication with the id %s has not been found', id),
        HttpStatus.NOT_FOUND
      )
    }
  }

  async create (createPostDto: CreatePublicationDto): Promise<Publication> {
    const createdPost = new this.publicationModel(createPostDto)
    return createdPost.save()
  }

  /* async update (updateUserDto: CreateUserDto) {

  } */

  async remove (id: number) {
    const res = await this.publicationModel.deleteOne({ id: id })
    if (res.result.ok === 1 && res.result.n === 1) {
      return {
        status: 204,
        message: 'Publication with the id ' + id + ' successfully deleted'
      }
    }
    return {
      status: 404,
      message:
        'An error occured when trying to remove the publication with the id : ' +
        id
    }
  }

  /*    getNextSequenceValue () {
    const sequenceDocument = this.userModel.estimatedDocumentCount();
    console.log("NB DOCUMENT" + sequenceDocument.getQuery()._id);
    return sequenceDocument.getQuery();
  } */
}
