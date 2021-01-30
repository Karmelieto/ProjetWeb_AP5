import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UtilsService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll (): Promise<User[]> {
    return this.userModel.find().exec()
  }
}
