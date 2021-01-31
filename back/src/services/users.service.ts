import { Model } from 'mongoose'
import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateUserDto } from '../dto/create-user.dto'
import * as util from 'util'

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private readonly logger = new Logger(UsersService.name);

  async findAll (): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne (pseudo: string): Promise<User> {
    return this.userModel.findOne({ pseudo: pseudo })
  }

  async create (createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    if (await this.isUserExist(createdUser.pseudo)) {
      throw new HttpException(
        util.format('The user %s already exist', createdUser.pseudo),
        HttpStatus.FORBIDDEN
      )
    } else {
      this.logger.debug('CREATING USER : ' + createdUser)
      return createdUser.save()
    }
  }

  async isUserExist (pseudo: string): Promise<boolean> {
    return !!(await this.findOne(pseudo))
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
}

/*  getNextSequenceValue () {

  } */
