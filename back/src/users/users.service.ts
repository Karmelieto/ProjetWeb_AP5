import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import * as util from 'util'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import axios from 'axios'

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

    if (await this.isUserExistByMail(user.mail)) {
      const myUser = await this.findOneByMail(user.mail)
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

  async create (createUserDto: CreateUserDto): Promise<any> {
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
        createdUser.profileImageLink = process.env.CLOUD_URL + '/default.svg'
      }

      await createdUser.save()
      const user: any = await this.findOneConnected(createdUser.pseudo)
      user.token = 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2'
      return user
    }
  }

  async update (updateUserDto: UpdateUserDto): Promise<User> {
    if(!(await this.checkUserConnectedIsAdminOrAuthorized(updateUserDto.lastPseudo, updateUserDto.pseudoUserConnected))) {
      throw new HttpException(
        util.format('The user %s is not authorized !', updateUserDto.pseudoUserConnected),
        HttpStatus.UNAUTHORIZED
      )
    }
    const myUser: User = await this.userModel.findOne({
      pseudo: updateUserDto.lastPseudo
    })
    if (myUser && (updateUserDto.lastPseudo === updateUserDto.newPseudo || !(await this.isUserExist(updateUserDto.newPseudo)))) {
      if(myUser.profileImageLink !== updateUserDto.profileImageLink) {
        const date = new Date();
        const dateString = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        const newImageLink = updateUserDto.newPseudo + '_' + dateString.replace(/[ :]/g, '_');

        updateUserDto.profileImageLink = await this.renameImageLink(
          updateUserDto.profileImageLink,
          newImageLink
        )

        this.removeProfileImage(myUser.profileImageLink);
      }
      try {
        await this.userModel.updateOne(
          { pseudo: updateUserDto.lastPseudo },
          {
            pseudo: updateUserDto.newPseudo,
            description: updateUserDto.description,
            profileImageLink: updateUserDto.profileImageLink
          }
        )

        return await this.findOneConnected(updateUserDto.newPseudo);
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

  async renameImageLink (actualName: string, newName: string): Promise<string> {
    return axios
      .put(process.env.CLOUD_URL, { actualName: actualName, newName: newName })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
        return ''
      })
  }

  async removeProfileImage(profileImageLink: string) {
    axios.delete(process.env.CLOUD_URL, {
      data: { url: profileImageLink, token: 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2' }
    })
  }

  async getFavoritesOfUser (pseudo: string): Promise<string[]> {
    const res = await this.userModel.findOne(
      { pseudo: pseudo },
      { favorites: 1 }
    )

    if (!res) return null
    return res.favorites
  }

  async addFavoriteToUser (pseudo: string, postId: string): Promise<boolean> {
    const user = await this.findOne(pseudo)
    if (!user) return false

    if (user.favorites.includes(postId)) return false

    await this.userModel.updateOne(
      { pseudo: user.pseudo },
      { $push: { favorites: postId } }
    )
    return true
  }

  async removeFavoriteToUser (pseudo: string, postId: string): Promise<boolean> {
    const user = await this.findOne(pseudo)
    if (!user) return false

    await this.userModel.updateOne(
      { pseudo: user.pseudo },
      { $pull: { favorites: postId } }
    )
    return true
  }

  async isUserExist (pseudo: string): Promise<boolean> {
    return !!(await this.findOne(pseudo))
  }

  async isUserExistByMail (mail: string): Promise<boolean> {
    return !!(await this.findOneByMail(mail))
  }

  async checkUserConnectedIsAdminOrAuthorized(pseudo: string, pseudoUserConnected: string): Promise<boolean> {
    if(pseudoUserConnected !== pseudo) {
      const userConnected = await this.userModel.findOne({ pseudo: pseudoUserConnected }, { isAdmin: 1});
      return userConnected.isAdmin;
    }
    return true;
  }

  async remove (deleteUserDto: DeleteUserDto) {
    if(!(await this.checkUserConnectedIsAdminOrAuthorized(deleteUserDto.pseudo, deleteUserDto.pseudoUserConnected))) {
      throw new HttpException(
        util.format('The user %s is not authorized !', deleteUserDto.pseudoUserConnected),
        HttpStatus.UNAUTHORIZED
      )
    }

    await axios
      .delete(
        process.env.SERVER_URL + 'publications/user/' + deleteUserDto.pseudo,
        {
          data: {
            pseudo: deleteUserDto.pseudoUserConnected,
            token: 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2'
          }
        }
      )
      .catch((err) => console.error(err.response.statusText))

    const user = await this.findOne(deleteUserDto.pseudo);
    this.removeProfileImage(user.profileImageLink);
    const res = await this.userModel.deleteOne({
      pseudo: deleteUserDto.pseudo
    })
    if (res.deletedCount === 0) {
      throw new HttpException(
        util.format(
          'The user %s might be already remove',
          deleteUserDto.pseudo
        ),
        HttpStatus.NOT_FOUND
      )
    }
  }
}
