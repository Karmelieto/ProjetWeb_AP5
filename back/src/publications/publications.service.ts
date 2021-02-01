import { Model } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'

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
    return this.publicationModel.findOne({ id: id })
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
