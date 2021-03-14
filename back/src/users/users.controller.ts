import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { ChangeFavoriteOfUserDto } from './dto/change-favorite-user.dto'
import { UsersService } from './users.service'
import { User } from './user.schema'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import * as util from 'util'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

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
    const user = await this.usersService.findOne(pseudo.toLowerCase())
    if (!user) {
      throw new HttpException(
        util.format('The user does not exist'),
        HttpStatus.NOT_FOUND
      )
    }
    return user
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
  @Post('/login/')
  @ApiOperation({
    summary: 'Login a user'
  })
  async login (@Body() loginUserDto: LoginUserDto, @Res() res): Promise<User> {
    return res.json(await this.usersService.login(loginUserDto))
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  @ApiOperation({
    summary: 'Update a user'
  })
  async update (@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(updateUserDto)
  }

  @Get('/favorites/:pseudo')
  @ApiOperation({
    summary: 'Find all favorites of one user'
  })
  async getAllFavoritesOfUser (
    @Param('pseudo') pseudo: string
  ): Promise<string[]> {
    const favorites = await this.usersService.getFavoritesOfUser(
      pseudo.toLowerCase()
    )
    if (!favorites) {
      throw new HttpException(
        util.format('The user %s does not exist', pseudo),
        HttpStatus.NOT_FOUND
      )
    }
    return favorites
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('favorites')
  @ApiOperation({
    summary: 'Add favorite to user'
  })
  async addFavoriteToUser (
    @Body() changeFavoriteOfUserDto: ChangeFavoriteOfUserDto
  ) {
    if (!changeFavoriteOfUserDto.idPost) {
      throw new HttpException(
        util.format('Post is is required'),
        HttpStatus.FORBIDDEN
      )
    }
    if (!changeFavoriteOfUserDto.pseudo) {
      throw new HttpException(
        util.format('Pseudo is required'),
        HttpStatus.FORBIDDEN
      )
    }
    const res = await this.usersService.addFavoriteToUser(
      changeFavoriteOfUserDto.pseudo,
      changeFavoriteOfUserDto.idPost
    )
    if (!res) {
      throw new HttpException(
        util.format(
          'The user %s does not exist or the post id %s is already in favorites',
          changeFavoriteOfUserDto.pseudo,
          changeFavoriteOfUserDto.idPost
        ),
        HttpStatus.NOT_FOUND
      )
    }
  }

  @Delete('/favorites')
  @ApiOperation({
    summary: 'Remove favorite from user'
  })
  async removeFavoriteToUser (
    @Body() changeFavoriteOfUserDto: ChangeFavoriteOfUserDto
  ) {
    if (!changeFavoriteOfUserDto.idPost) {
      throw new HttpException(
        util.format('Post is required'),
        HttpStatus.FORBIDDEN
      )
    }
    if (!changeFavoriteOfUserDto.pseudo) {
      throw new HttpException(
        util.format('Pseudo is required'),
        HttpStatus.FORBIDDEN
      )
    }
    const res = await this.usersService.removeFavoriteToUser(
      changeFavoriteOfUserDto.pseudo,
      changeFavoriteOfUserDto.idPost
    )
    if (!res) {
      throw new HttpException(
        util.format(
          'The user %s does not exist',
          changeFavoriteOfUserDto.pseudo
        ),
        HttpStatus.NOT_FOUND
      )
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully deleted.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({
    summary: 'Remove a user by his pseudo'
  })
  async remove (@Body() deleteUserDto: DeleteUserDto) {
    await this.usersService.remove(deleteUserDto)
  }
}
