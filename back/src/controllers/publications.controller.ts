import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { PublicationsService } from '../services/publications.service'
import { Publication } from '../schemas/publication.schema'
import { CreatePublicationDto } from '../dto/create-publication.dto'

@Controller('publications')
@ApiTags('publications')
export class PublicationsController {
  constructor (private readonly publicationsService: PublicationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all publications'
  })
  async findAll (): Promise<Publication[]> {
    return this.publicationsService.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a publication by his id'
  })
  async findOne (@Param('id') id: number) {
    return this.publicationsService.findOne(id)
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The publication has been successfully created.',
    type: Post
  })
  @ApiOperation({
    summary: 'Create a publication'
  })
  async create (@Body() createPublicationDto: CreatePublicationDto) {
    await this.publicationsService.create(createPublicationDto)
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a publication by his id'
  })
  async update (
    @Param('id') id: number,
    @Body() updatePublicationDto: CreatePublicationDto
  ) {
    // await this.usersService.update(updateUserDto)
    console.log('Has to update the publication with the id %s', id)
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The publication has been successfully remove.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({
    summary: 'Remove a publication by his id'
  })
  async remove (@Param('id') id: number) {
    await this.publicationsService.remove(id)
  }
}
