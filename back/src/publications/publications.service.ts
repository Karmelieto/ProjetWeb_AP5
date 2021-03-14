import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Publication, PublicationDocument } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
import { ExifImage } from 'exif'
import { defaults } from 'request'
import axios from 'axios'
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

  async getTwoRandom (tag: string): Promise<Publication[]> {
    return this.publicationModel.aggregate([
      { $match: { tags: tag } },
      { $sample: { size: 2 } },
      { $project: { imageLink: 1 } }
    ])
  }

  async vote (id: string, point: number): Promise<Publication> {
    return this.publicationModel.update(
      { _id: id },
      { $inc: { nbVotes: 1, points: point } }
    )
  }

  async findAllByTag (tag: string): Promise<Publication[]> {
    const totalCount = await this.publicationModel.find().countDocuments()
    return this.publicationModel.aggregate([
      { $sample: { size: totalCount } },
      { $match: { tags: tag } },
      { $project: { imageLink: 1, rank: 1 } }
    ])
  }

  async findAllByPseudo (pseudo: string): Promise<Publication[]> {
    return this.publicationModel
      .find(
        {
          pseudo: pseudo
        },
        {
          imageLink: 1,
          rank: 1
        }
      )
      .exec()
  }

  async findAllByArrayOfId (ids: Array<string>): Promise<Publication[]> {
    return this.publicationModel
      .find(
        {
          _id: {
            $in: ids
          }
        },
        { imageLink: 1, rank: 1 }
      )
      .exec()
  }

  async findOne (id: string): Promise<Publication> {
    return this.publicationModel.findOne({ _id: id })
  }

  async create (createPostDto: CreatePublicationDto): Promise<Publication> {
    const createdPost = new this.publicationModel(createPostDto)
    console.log(createdPost)
    if (!createdPost.tags || createdPost.tags.length === 0) {
      throw new HttpException(
        util.format('The publication %s doesn\'t have any tags', createdPost.id),
        HttpStatus.FORBIDDEN
      )
    }

    const date = new Date()
    const dateString =
      date.toDateString() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds()

    createdPost.date = dateString
    createdPost.nbVotes = 0
    createdPost.rank = 0
    createdPost.points = 0

    console.log('1', createdPost)
    if (createdPost.imageLink.indexOf('default') === -1) {
      const newImageLink =
        createPostDto.pseudo + '_' + dateString.replace(/[ :]/g, '_')
      createdPost.imageLink = await this.renameImageLink(
        createdPost.imageLink,
        newImageLink
      )
    }

    this.setExif(createdPost)
    return createdPost.save()
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

  async remove (
    id: string,
    pseudoUserConnected: string,
    token: string
  ): Promise<boolean> {
    const publication = await this.findOne(id)
    if (!publication) {
      return false
    }

    const isVerified = await this.verifyUserAndToken(
      publication.pseudo,
      pseudoUserConnected,
      token
    )
    if (!isVerified) {
      return false
    }

    axios.delete(process.env.CLOUD_URL, {
      data: { url: publication.imageLink, token: token }
    })

    const res = await this.publicationModel.deleteOne({ _id: id })

    if (res.ok === 0 || res.n === 0) {
      return false
    }
    return true
  }

  setExif (createdPost) {
    console.log(createdPost)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const request = defaults({ encoding: null })
    request.get(createdPost.imageLink, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          // eslint-disable-next-line no-new
          new ExifImage({ image: body }, async function (error, imageInfo) {
            if (!error) {
              console.log(imageInfo)
              createdPost.metaDatas = {
                cameraModel: imageInfo.image.Model,
                focal: imageInfo.exif.FNumber,
                focalLength: imageInfo.exif.FocalLength,
                expositionTime: imageInfo.exif.ExposureTime,
                dateAndTimeOfCreation: imageInfo.exif.DateTimeOriginal
              }
              await that.publicationModel.updateOne(
                { _id: createdPost._id },
                {
                  metaDatas: createdPost.metaDatas
                }
              )
            } else {
              console.log('Error: ' + error.message)
            }
          })
        } catch (error) {
          console.log('Error: ' + error.message)
        }
      }
    })
  }

  async removeAllFromUser (
    pseudo: string,
    pseudoUserConnected: string,
    token: string
  ): Promise<boolean> {
    const isVerified = await this.verifyUserAndToken(
      pseudo,
      pseudoUserConnected,
      token
    )
    if (!isVerified) {
      return false
    }

    const publications = await this.publicationModel
      .find({ pseudo: pseudo }, { _id: 1 })
      .exec()
    for (let i = 0; i < publications.length; i++) {
      await this.remove(publications[i]._id, pseudoUserConnected, token)
    }

    console.log('All publications of %s have been deleted !', pseudo)
    return true
  }

  async verifyUserAndToken (
    pseudo: string,
    pseudoUserConnected: string,
    token: string
  ) {
    if (token !== 'eKoYea331nJhfnqIzeLap8jSd4SddpalqQ93Nn2') {
      return false
    }

    const user = await axios
      .get(process.env.SERVER_URL + 'users/' + pseudoUserConnected)
      .then((response) => response.data)
    if (!user.isAdmin && pseudo !== pseudoUserConnected) {
      return false
    }
    return true
  }
}
