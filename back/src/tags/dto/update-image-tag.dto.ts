import { ApiProperty } from '@nestjs/swagger'

export class UpdateImageTagDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  newImageLink: string;
}
