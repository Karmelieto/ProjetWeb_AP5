import { ApiProperty } from '@nestjs/swagger';
import { MetaData } from '../../models/MetaData';
import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export class CreatePublicationDto {
  @ApiProperty()
  imageLink: string;

  @ApiProperty()
  @Transform((pseudo) => pseudo.value.toLowerCase())
  pseudo: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    default: [],
  })
  @ApiProperty()
  tags: string[];

  @ApiProperty()
  nbVotes: number;

  @ApiProperty({
    default: null,
  })
  @Prop()
  metaDatas: MetaData;

  @ApiProperty()
  points: number;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  date: string;
}
