import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { User } from './user.schema'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all users'
  })
  async findAll (): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Get(':pseudo')
  @ApiOperation({
    summary: 'Retrieve a user by his pseudo'
  })
  async findOne (@Param('pseudo') pseudo: string) {
    return this.usersService.findOne(pseudo.toLowerCase())
  }

  @Get('filter/:pseudo')
  @ApiOperation({
    summary: 'Retrieve users filter by a pseudo'
  })
  async searchUsersByPseudo (@Param('pseudo') pseudo: string) {
    return this.usersService.searchUsersByPseudo(pseudo.toLowerCase())
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiOperation({
    summary: 'Create a user'
  })
  async create (
    @Body() createUserDto: CreateUserDto,
    @Res() res
  ): Promise<User> {
    return res.json(await this.usersService.create(createUserDto))
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  @ApiOperation({
    summary: 'Update a user'
  })
  async update (@Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(updateUserDto)
  }

  @Delete(':pseudo')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully deleted.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({
    summary: 'Remove a user by his pseudo'
  })
  async remove (@Param('pseudo') pseudo: string) {
    await this.usersService.remove(pseudo.toLowerCase())
  }
}
