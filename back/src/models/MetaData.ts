import { ApiProperty } from '@nestjs/swagger'

export class MetaData {
  @ApiProperty()
  cameraModel: string;

  @ApiProperty()
  focal: string;

  @ApiProperty()
  focalLength: string;

  @ApiProperty()
  expositionTime: string;

  @ApiProperty()
  dateAndTimeOfCreation: string;
}
