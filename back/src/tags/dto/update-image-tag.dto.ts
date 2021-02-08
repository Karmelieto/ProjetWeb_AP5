import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class UpdateImageTagDto {
  @Transform((name) => name.value.toLowerCase())
  @ApiProperty()
  name: string;

  @ApiProperty()
  newImageLink: string;
}
