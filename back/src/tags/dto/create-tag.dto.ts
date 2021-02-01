import { ApiProperty } from '@nestjs/swagger'

export class CreateTagDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  imageLink: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  usersAllow: string[];
}
