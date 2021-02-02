import {Model} from 'mongoose'
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Publication, PublicationDocument} from './publication.schema'
import {CreatePublicationDto} from './dto/create-publication.dto'
import * as util from 'util'

@Injectable()
export class PublicationsService {
  constructor (
    @InjectModel(Publication.name)
    private publicationModel: Model<PublicationDocument>
  ) {}

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
      return null
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
        message: util.format("Publication with the id %s successfully deleted", id)
      }
    }
    return {
      status: 404,
      message: util.format("An error occured when trying to remove the publication with the id : %s ", id)
    }
  }

  /*    getNextSequenceValue () {
    const sequenceDocument = this.userModel.estimatedDocumentCount();
    console.log("NB DOCUMENT" + sequenceDocument.getQuery()._id);
    return sequenceDocument.getQuery();
  } */
}
