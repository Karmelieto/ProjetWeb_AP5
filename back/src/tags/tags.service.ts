import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as util from 'util'
import { Tag, TagDocument } from './tag.schema'
import { CreateTagDto } from './dto/create-tag.dto'
import {UpdateImageTagDto} from "./dto/update-image-tag.dto";

@Injectable()
export class TagsService {
  constructor (@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  private readonly logger = new Logger(TagsService.name);

  async findAll (): Promise<Tag[]> {
    return this.tagModel.find().exec()
  }

  async findOne (name: string): Promise<Tag> {
    const tag: Tag = await this.tagModel.findOne({ name: name })
    if (tag) {
      return tag
    } else {
      throw new HttpException(
        util.format('The tag %s has not been found', name),
        HttpStatus.NOT_FOUND
      )
    }
  }

  async create (createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto)
    if (await this.isTagExist(createdTag.name)) {
      throw new HttpException(
        util.format('The tag %s already exist', createdTag.name),
        HttpStatus.FORBIDDEN
      )
    } else {
      this.logger.debug('CREATING TAG : ' + createdTag)
      return createdTag.save()
    }
  }


  async updateImageTag (updateImageTagDto: UpdateImageTagDto): Promise<Tag> {
    this.logger.debug(updateImageTagDto)
    const myTag: Tag = await this.tagModel.findOne({
      name: updateImageTagDto.name
    })
    if (myTag) {
      try {
        await this.tagModel.updateOne(
          { name: updateImageTagDto.name },
          {
            imageLink: updateImageTagDto.newImageLink
          }
        )
        const updatedTag = await this.tagModel.findOne({ name: updateImageTagDto.name })
        this.logger.debug('UPDATE FINISHED ' + updatedTag)
        return updatedTag
      } catch (e) {
        throw new HttpException(
          util.format('There was a problem when trying to update the tag', updateImageTagDto.name),
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      throw new HttpException(
        util.format('The tag %s does not exist', updateImageTagDto.name),
        HttpStatus.NOT_FOUND
      )
    }
  }


  /* async update (updateTagDto: UpdateTagDto): Promise<Tag> {
    this.logger.debug(updateTagDto)
    const myTag: Tag = await this.userModel.findOne({
      name: updateTagDto.lastPseudo
    })
    if (myTag) {
      try {
        await this.tagModel.updateOne(
          { name: updateTagDto.lastName },
          {
            name: updateTagDto.newPseudo,
            password: updateTagDto.password,
            mail: updateTagDto.mail,
            description: updateTagDto.description,
            profileImageLink: updateTagDto.profileImageLink
          }
        )
        this.logger.debug(
          'UPDATE FINISHED ' +
            (await this.userModel.findOne({ name: updateTagDto.newPseudo }))
        )
        return this.userModel.findOne({ name: updateTagDto.newPseudo })
      } catch (e) {
        throw new HttpException(
          util.format('There was a problem when trying to update the user', updateTagDto.lastPseudo),
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      throw new HttpException(
        util.format('The user %s does not exist', updateTagDto.lastPseudo),
        HttpStatus.NOT_FOUND
      )
    }
  }
*/
  async isTagExist (name: string): Promise<boolean> {
    return !!(await this.findOne(name))
  }

  async remove (name: string) {
    const res = await this.tagModel.deleteOne({ name: name })
    if (res.deletedCount !== 0) {
      return {
        status: 204,
        message: util.format('Tag %s successfully remove', name)
      }
    }
    throw new HttpException(
      util.format('The tag %s might be already remove', name),
      HttpStatus.NOT_FOUND
    )
  }
}
