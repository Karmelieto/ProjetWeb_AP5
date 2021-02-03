import { Reward } from '../../models/Reward'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    default: false
  })
  isAdmin: boolean;

  @ApiProperty({
    default: []
  })
  favorisPosts: number[];

  @ApiProperty({
    default: []
  })
  rewards: Reward[];
}
