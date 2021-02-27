import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import * as util from 'util'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private readonly logger = new Logger(UsersService.name);

  async findAll (): Promise<User[]> {
    return this.userModel
      .find(
        {},
        {
          pseudo: 1,
          profileImageLink: 1
        }
      )
      .exec()
  }

  async findOne (pseudo: string): Promise<User> {
    return this.userModel.findOne(
      { pseudo: pseudo },
      {
        password: 0,
        mail: 0
      }
    )
  }

  async findOneByMail (mail: string): Promise<User> {
    return this.userModel.findOne(
      { mail: mail },
      {
        pseudo: 1,
        password: 1,
        isAdmin: 1,
        profileImageLink: 1
      }
    )
  }

  async findOneConnected (pseudo: string): Promise<User> {
    return this.userModel.findOne(
      { pseudo: pseudo },
      {
        pseudo: 1,
        profileImageLink: 1,
        isAdmin: 1
      }
    )
  }

  async searchUsersByPseudo (pseudo: string): Promise<User[]> {
    return this.userModel
      .find(
        { pseudo: new RegExp(pseudo) },
        {
          pseudo: 1,
          profileImageLink: 1
        }
      )
      .exec()
  }

  async login (loginUserDto: LoginUserDto): Promise<any> {
    const user = new this.userModel(loginUserDto)
    console.log(user)
    if (await this.isUserExistByMail(user.mail)) {
      const myUser = await this.findOneByMail(user.mail)
      console.log(myUser)
      if (myUser.password === user.password) {
        return {
          pseudo: myUser.pseudo,
          isAdmin: myUser.isAdmin,
          profileImageLink: myUser.profileImageLink,
          token: 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2'
        }
      } else {
        throw new HttpException(
          util.format('Wrong password'),
          HttpStatus.UNAUTHORIZED
        )
      }
    } else {
      throw new HttpException(
        util.format('The user does not exist'),
        HttpStatus.NOT_FOUND
      )
    }
  }
  
  async create (createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)

    if (await this.isUserExist(createdUser.pseudo)) {
      throw new HttpException(
        util.format('The user name %s already exist', createdUser.pseudo),
        HttpStatus.FORBIDDEN
      )
    } else {
      if (!createdUser.pseudo || !createdUser.mail || !createdUser.password) {
        throw new HttpException(
          util.format('The user has empty required datas'),
          HttpStatus.FORBIDDEN
        )
      }

      if (await this.userModel.findOne({ mail: createdUser.mail })) {
        throw new HttpException(
          util.format('The user mail %s already exist', createdUser.mail),
          HttpStatus.FORBIDDEN
        )
      }

      if (!createdUser.isAdmin) {
        createdUser.isAdmin = false
      }

      if (!createdUser.description) {
        createdUser.description = 'What a great description !'
      }

      if (!createdUser.profileImageLink) {
        createdUser.profileImageLink =
          'http://89.158.244.191:17001/images/default.svg'
      }

      await createdUser.save()
      return await this.findOneConnected(createdUser.pseudo)
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

  async isUserExistByMail (mail: string): Promise<boolean> {
    return !!(await this.findOneByMail(mail))
  }

  async remove (deleteUserDto: DeleteUserDto) {
    const userConnected = await this.userModel.findOne({ pseudo: deleteUserDto.pseudoUserConnected }, { isAdmin: 1});
    if(!userConnected.isAdmin) {
      throw new HttpException(
        util.format('The user connected %s might be an admin !', deleteUserDto.pseudoUserConnected),
        HttpStatus.FORBIDDEN
      )
    }

    const res = await this.userModel.deleteOne({ pseudo: deleteUserDto.pseudo })
    if (res.deletedCount === 0) {
      throw new HttpException(
        util.format('The user %s might be already remove', deleteUserDto.pseudo),
        HttpStatus.NOT_FOUND
      )
    }
  }
}
