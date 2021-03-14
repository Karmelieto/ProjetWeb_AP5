import { ApiProperty } from '@nestjs/swagger'

export class UpdateImageTagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  newImageLink: string;
}
