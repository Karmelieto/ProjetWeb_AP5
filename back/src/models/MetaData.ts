import { ApiProperty } from '@nestjs/swagger'

export class MetaData {
  // Global Positioning System

  @ApiProperty()
  gpsAltitude: string;

  @ApiProperty()
  gpsLatitude: string;

  @ApiProperty()
  gpsLongitude: string;

  // Image Information

  @ApiProperty()
  dateAndTime: string;

  @ApiProperty()
  manufacturer: string;

  @ApiProperty()
  model: string;

  // Photograph Information

  @ApiProperty()
  aperture: string;

  @ApiProperty()
  exposureBlas: string;

  @ApiProperty()
  exposureMode: string;

  @ApiProperty()
  exposureProgram: string;

  @ApiProperty()
  exposureTime: string;

  @ApiProperty()
  flash: string;

  @ApiProperty()
  fNumber: string;

  @ApiProperty()
  focalLength: string;

  @ApiProperty()
  isoSpeedRatings: string;

  @ApiProperty()
  meteringMode: string;

  @ApiProperty()
  shutterSpeed: string;

  @ApiProperty()
  whiteBalance: string;
}
