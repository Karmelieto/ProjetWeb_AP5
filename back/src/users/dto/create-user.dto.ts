import { Reward } from '../../models/Reward';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @Transform((pseudo) => pseudo.value.toLowerCase())
  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsEmail()
  mail: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    default: [],
  })
  favorisPosts: number[];

  @ApiProperty({
    default: [],
  })
  rewards: Reward[];
}
