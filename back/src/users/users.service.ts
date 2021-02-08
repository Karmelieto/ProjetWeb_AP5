import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import * as util from 'util'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private readonly logger = new Logger(UsersService.name);

  async findAll (): Promise<User[]> {
    return this.userModel
      .find(
        {},
        {
          password: 0,
          rewards: 0,
          isAdmin: 0,
          favorisPosts: 0,
          description: 0,
          _id: 0,
          __v: 0
        }
      )
      .exec()
  }

  async findOne (pseudo: string): Promise<User> {
    return this.userModel.findOne(
      { pseudo: pseudo },
      {
        password: 0
      }
    )
  }

  async searchUsersByPseudo (pseudo: string): Promise<User[]> {
    return this.userModel
      .find(
        { pseudo: new RegExp(pseudo) },
        {
          password: 0,
          mail: 0,
          rewards: 0,
          isAdmin: 0,
          favorisPosts: 0,
          description: 0,
          _id: 0,
          __v: 0
        }
      )
      .exec()
  }

  async create (createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    console.log(createUserDto)
    if (await this.isUserExist(createdUser.pseudo)) {
      throw new HttpException(
        util.format('The user name %s already exist', createdUser.pseudo),
        HttpStatus.FORBIDDEN
      )
    } else {
      if (!createdUser.pseudo || !createdUser.mail || !createdUser.password) {
        throw new HttpException(
          util.format('The user have empty required datas'),
          HttpStatus.FORBIDDEN
        )
      }

      console.log('USER MAIL : ' + createdUser.mail)
      if (await this.userModel.findOne({ mail: createdUser.mail })) {
        throw new HttpException(
          util.format('The user mail %s already exist', createdUser.mail),
          HttpStatus.FORBIDDEN
        )
      }

      if (!createdUser.isAdmin) {
        createdUser.isAdmin = false
      }

      if (!createdUser.profileImageLink) {
        createdUser.profileImageLink =
          'http://localhost:4242/images/default.svg'
      }

      this.logger.debug('CREATING USER : ' + createdUser)
      createdUser.password = '*****'
      return createdUser.save()
    }
  }

  async update (updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.debug(updateUserDto)
    const myUser: User = await this.userModel.findOne({
      pseudo: updateUserDto.lastPseudo
    })
    if (myUser && !(await this.isUserExist(updateUserDto.newPseudo))) {
      try {
        await this.userModel.updateOne(
          { pseudo: updateUserDto.lastPseudo },
          {
            pseudo: updateUserDto.newPseudo,
            password: updateUserDto.password,
            description: updateUserDto.description,
            profileImageLink: updateUserDto.profileImageLink
          }
        )
        this.logger.debug(
          'UPDATE FINISHED ' +
            (await this.userModel.findOne(
              { pseudo: updateUserDto.newPseudo },
              {
                password: 0
              }
            ))
        )
        return this.userModel.findOne(
          { pseudo: updateUserDto.newPseudo },
          {
            password: 0
          }
        )
      } catch (e) {
        throw new HttpException(
          util.format(
            'There was a problem when trying to update the user',
            updateUserDto.lastPseudo
          ),
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      throw new HttpException(
        util.format(
          'There was a problem when trying to update the user',
          updateUserDto.lastPseudo
        ),
        HttpStatus.NOT_FOUND
      )
    }
  }

  async isUserExist (pseudo: string): Promise<boolean> {
    return !!(await this.findOne(pseudo))
  }

  async remove (pseudo: string) {
    const res = await this.userModel.deleteOne({ pseudo: pseudo })
    if (res.deletedCount !== 0) {
      return {
        status: 204,
        message: util.format('User %s successfully remove', pseudo)
      }
    }
    throw new HttpException(
      util.format('The user %s might be already remove', pseudo),
      HttpStatus.NOT_FOUND
    )
  }
}
