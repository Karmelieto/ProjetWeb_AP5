import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as util from 'util'
import { Tag, TagDocument } from './tag.schema'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateImageTagDto } from './dto/update-image-tag.dto'

@Injectable()
export class TagsService {
  constructor (@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  private readonly logger = new Logger(TagsService.name);

  async findAll (pseudo: string): Promise<Tag[]> {
    return this.tagModel.find(
      { 
        $or: [
          { isPrivate: false },
          { $and: [
            { isPrivate: true },
            { usersAllow: pseudo }
          ]}
        ]
      },
      {
        name: 1,
        imageLink: 1
      }
    ).exec()
  }

  async findOne (id: string): Promise<Tag> {
    const tag: Tag = await this.tagModel.findOne({ id: id })
    if (tag) {
      return tag
    } else {
      return null
    }
  }

  async getRandomTag () : Promise<Tag[]> {
    const randomTags: Tag[] = await this.tagModel.aggregate([
        { $sample: { size: 1 } }
    ])
    if (randomTags) {
      return randomTags
    } else {
      return null
    }
  }

  async getAllTagsByIds (ids: string[]): Promise<Tag[]> {
    return await this.tagModel.find(
      {
        _id:
          {
            $in: ids
          }
      }
    ).exec()
  }

  async searchTagsByName (name: string, pseudo: string): Promise<Tag[]> {
    return this.tagModel
      .find(
        { 
          $and: [
            { name: new RegExp(name) },
            { $or: [
              { isPrivate: false },
              { $and: [
                { isPrivate: true },
                { usersAllow: pseudo }
              ]}
            ]}         
          ]
        },
        {
          name: 1,
          imageLink: 1
        }
      )
      .exec()
  }

  async create (createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto)
    if (!createdTag.isPrivate && await this.isTagExist(createdTag.name)) {
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
      _id: updateImageTagDto.id
    })
    if (myTag) {
      try {
        await this.tagModel.updateOne(
          { _id: updateImageTagDto.id },
          {
            imageLink: updateImageTagDto.newImageLink
          }
        )
        const updatedTag = await this.tagModel.findOne({
          _id: updateImageTagDto.id
        })
        this.logger.debug('UPDATE FINISHED ' + updatedTag)
        return updatedTag
      } catch (e) {
        throw new HttpException(
          util.format(
            'There was a problem when trying to update the tag ',
            updateImageTagDto.id
          ),
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    } else {
      throw new HttpException(
        util.format('The tag %s does not exist', updateImageTagDto.id),
        HttpStatus.NOT_FOUND
      )
    }
  }

  async isTagExist (id: string): Promise<boolean> {
    return !!(await this.findOne(id))
  }

  async remove (id: string) {
    const res = await this.tagModel.deleteOne({ id: id })
    if (res.deletedCount !== 0) {
      return {
        status: 204,
        message: util.format('Tag %s successfully remove', id)
      }
    }
    throw new HttpException(
      util.format('The tag %s might be already remove', id),
      HttpStatus.NOT_FOUND
    )
  }
}
