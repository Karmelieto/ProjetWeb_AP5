import { ApiProperty } from '@nestjs/swagger'

export class CreateTagDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  imageLink: string;

  @ApiProperty({
    default: false
  })
  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty({
    default: []
  })
  @ApiProperty()
  usersAllow: string[];
}
