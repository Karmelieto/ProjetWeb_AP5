import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { PublicationsService } from './publications.service'
import { Publication } from './publication.schema'
import { CreatePublicationDto } from './dto/create-publication.dto'
import { DeletePublicationDto } from './dto/delete-publication.dto'

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

  @Get('tag/:tag')
  @ApiOperation({
    summary: 'Find all publications by tag'
  })
  async findAllByTag (@Param('tag') tag: string): Promise<Publication[]> {
    return this.publicationsService.findAllByTag(tag)
  }
  
  @Get('user/:pseudo')
  @ApiOperation({
    summary: 'Find all publications post by a user'
  })
  async findAllByPseudo (@Param('pseudo') pseudo: string): Promise<Publication[]> {
    return this.publicationsService.findAllByPseudo(pseudo)
  }

  @Get('favorites/:ids')
  @ApiOperation({
    summary: 'Find all publications in the array of ids given'
  })
  async findAllByArrayOfId (@Param('ids') ids: string): Promise<Publication[]> {
    return this.publicationsService.findAllByArrayOfId(ids.split(','))
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a publication by its id'
  })
  async findOne (@Param('id') id: string) {
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
    return await this.publicationsService.create(createPublicationDto)
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a publication by its id'
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
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiOperation({
    summary: 'Remove a publication by his id'
  })
  async remove (@Param('id') id: string, @Body() deletePublicationDto: DeletePublicationDto, @Res() res) {
    const isDeleted = await this.publicationsService.remove(id, deletePublicationDto.pseudo, deletePublicationDto.token);

    if(!isDeleted) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(201);
  }

  @Delete('user/:pseudo')
  @ApiResponse({
    status: 201,
    description: 'The publications have been successfully remove.'
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiOperation({
    summary: 'Remove all publications of a user by them pseudo'
  })
  async removeAllFromUser (@Param('pseudo') pseudo: string, @Body() deletePublicationDto: DeletePublicationDto, @Res() res) {
    const isDeleted = await this.publicationsService.removeAllFromUser(pseudo, deletePublicationDto.pseudo, deletePublicationDto.token);

    if(!isDeleted) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(201);
  }
}
