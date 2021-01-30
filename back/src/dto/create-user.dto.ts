import { Reward } from '../models/Reward'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../models/UserRole'

export class CreateUserDto {
  @ApiProperty()
  _id: number;

  @ApiProperty({
    example: 'Toto'
  })
  pseudo: string;

  @ApiProperty({
    example: 'toto@gmail.com'
  })
  mail: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty({
    example: 'Je suis TOTO'
  })
  description: string;

  @ApiProperty({
    example: 'User'
  })
  userRole: UserRole;

  @ApiProperty()
  favorisPosts: number[];

  @ApiProperty()
  rewards: Reward[];
}
