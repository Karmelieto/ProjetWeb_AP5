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

  @Get(':pseudo')
  @ApiOperation({
    summary: 'Retrieve all tags with a pseudo'
  })
  async findAllByPseudo (@Param('pseudo') pseudo: string): Promise<Tag[]> {
    return this.tagsService.findAll(pseudo.toLowerCase());
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tags'
  })
  async findAll (): Promise<Tag[]> {
    return this.tagsService.findAll('');
  }

  @Get('/random')
  @ApiOperation({
    summary: 'Retrieve a given number of random tags'
  })
  async getRandomTag () : Promise<Tag[]> {
    return this.tagsService.getRandomTag()
  }

  @Get('/ids/:ids')
  @ApiOperation({
    summary: 'Retrieve all tags by matching ids'
  })
  async getAllTagsByIds (@Param('ids') ids: string): Promise<Tag[]> {
    return await this.tagsService.getAllTagsByIds(ids.split(','));
  }

  @Get('filter/:name/:pseudo')
  @ApiOperation({
    summary: 'Retrieve tags filter by a name, and check is private'
  })
  async searchTagsByNameWithPseudo (@Param('name') name: string, @Param('pseudo') pseudo: string) {
    return this.tagsService.searchTagsByName(name.toLowerCase(), pseudo.toLowerCase());
  }

  @Get('filter/:name')
  @ApiOperation({
    summary: 'Retrieve tags filter by a name, and check is private'
  })
  async searchTagsByName (@Param('name') name: string) {
    return this.tagsService.searchTagsByName(name.toLowerCase(), '');
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
    return await this.tagsService.create(createTagDto)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  @ApiOperation({
    summary: 'Update imageLink of a tag'
  })
  async update (@Body() updateImageTagDto: UpdateImageTagDto) {
    console.log(updateImageTagDto);
    await this.tagsService.updateImageTag(updateImageTagDto)
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully deleted.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({
    summary: 'Remove a tag by his name'
  })
  async remove (@Param('id') id: string) {
    await this.tagsService.remove(id.toLowerCase())
  }
}
