import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll (): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne (pseudo: string): Promise<User> {
    return this.userModel.findOne({ pseudo: pseudo })
  }

  async create (createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }

  /* async update (updateUserDto: CreateUserDto) {

  } */

  async remove (pseudo: string) {
    const res = await this.userModel.deleteOne({ pseudo: pseudo })
    if (res.result.ok === 1 && res.result.n === 1) {
      return {
        status: 204,
        message: 'User ' + pseudo + ' successfully deleted'
      }
    }
    return {
      status: 404,
      message: 'An error occured when trying to remove ' + pseudo
    }
  }

  /*    getNextSequenceValue () {
    const sequenceDocument = this.userModel.estimatedDocumentCount();
    console.log("NB DOCUMENT" + sequenceDocument.getQuery()._id);
    return sequenceDocument.getQuery();
  } */
}
