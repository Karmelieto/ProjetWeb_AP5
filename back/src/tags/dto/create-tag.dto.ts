import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CreateTagDto {
  @Transform((name) => name.value.toLowerCase())
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
