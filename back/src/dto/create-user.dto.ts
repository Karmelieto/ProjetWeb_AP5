import { Reward } from '../models/Reward'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  _id: number;

  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  favorisPosts: number[];

  @ApiProperty()
  rewards: Reward[];
}
