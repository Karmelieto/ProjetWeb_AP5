import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Tag } from './tag.schema'
import { CreateTagDto } from './dto/create-tag.dto'
import { TagsService } from './tags.service'
import { UpdateImageTagDto } from './dto/update-image-tag.dto'

@Controller('tags')
@ApiTags('tags')
export class TagsController {
  constructor (private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tags'
  })
  async findAll (): Promise<Tag[]> {
    return this.tagsService.findAll()
  }

  @Get('filter/:name')
  @ApiOperation({
    summary: 'Retrieve tags filter by a name'
  })
  async searchTagsByName (@Param('name') name: string) {
    return this.tagsService.searchTagsByName(name.toLowerCase())
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Retrieve a tag by his name'
  })
  async findOne (@Param('name') name: string) {
    return this.tagsService.findOne(name.toLowerCase())
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Tag
  })
  @ApiOperation({
    summary: 'Create a tag'
  })
  async create (@Body() createTagDto: CreateTagDto) {
    await this.tagsService.create(createTagDto)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  @ApiOperation({
    summary: 'Update imageLink of a tag'
  })
  async update (@Body() updateImageTagDto: UpdateImageTagDto) {
    await this.tagsService.updateImageTag(updateImageTagDto)
  }

  /*  @Put()
  @ApiOperation({
    summary: 'Update a tag'
  })
  async update (@Body() updateTagDto: UpdateTagDto) {
    await this.tagsService.update(updateTagDto)
  } */

  @Delete(':name')
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully deleted.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({
    summary: 'Remove a tag by his name'
  })
  async remove (@Param('name') name: string) {
    await this.tagsService.remove(name.toLowerCase())
  }
}
