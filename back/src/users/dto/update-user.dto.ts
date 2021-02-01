import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty()
  lastPseudo: string;

  @ApiProperty()
  newPseudo: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty()
  description: string;
}
