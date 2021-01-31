import { ApiProperty } from '@nestjs/swagger'
import { MetaData } from '../models/MetaData'

export class CreatePublicationDto {
  _id: number;

  @ApiProperty()
  imageLink: string;

  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  metaData: MetaData;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  nbVotes: number;

  @ApiProperty()
  points: number;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  date: string;
}
