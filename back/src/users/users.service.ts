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
    return this.userModel.find().exec()
  }

  async findOne (pseudo: string): Promise<User> {
    return await this.userModel.findOne({ pseudo: pseudo })
  }

  async create (createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    if (await this.isUserExist(createdUser.pseudo)) {
      throw new HttpException(
        util.format('The user %s already exist', createdUser.pseudo),
        HttpStatus.FORBIDDEN
      )
    } else {

      if(createUserDto.pseudo === "" || createUserDto.pseudo === undefined || createUserDto.mail === "" ||createUserDto.mail === undefined || createUserDto.password === "" || createUserDto.password === undefined ){
        throw new HttpException(
          util.format('The user have empty required datas'),
          HttpStatus.FORBIDDEN
        )
      }

      if (!createdUser.isAdmin) {
        createdUser.isAdmin = false
      }

      if(createdUser.profileImageLink === undefined || createdUser.profileImageLink === null)
        createdUser.profileImageLink = "http://localhost:4242/images/default.svg";
        
      this.logger.debug('CREATING USER : ' + createdUser)
      return createdUser.save()
    }
  }

  async update (updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.debug(updateUserDto)
    const myUser: User = await this.userModel.findOne({
      pseudo: updateUserDto.lastPseudo
    })
    if (myUser) {
      try {
        await this.userModel.updateOne(
          { pseudo: updateUserDto.lastPseudo },
          {
            pseudo: updateUserDto.newPseudo,
            password: updateUserDto.password,
            mail: updateUserDto.mail,
            description: updateUserDto.description,
            profileImageLink: updateUserDto.profileImageLink
          }
        )
        this.logger.debug(
          'UPDATE FINISHED ' +
            (await this.userModel.findOne({ pseudo: updateUserDto.newPseudo }))
        )
        return this.userModel.findOne({ pseudo: updateUserDto.newPseudo })
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
        util.format('The user %s does not exist', updateUserDto.lastPseudo),
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
