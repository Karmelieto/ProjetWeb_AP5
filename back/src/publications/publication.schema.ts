import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MetaData2 } from '../models/MetaData2'
import { ApiProperty } from '@nestjs/swagger'

export type PublicationDocument = Publication & Document;

@Schema()
export class Publication {
  @ApiProperty()
  @Prop()
  imageLink: string;

  @ApiProperty()
  @Prop()
  pseudo: string;

  @ApiProperty()
  @Prop()
  tags: string[];

  @ApiProperty({
    default: null
  })
  @Prop()
  metaDatas: MetaData2;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  nbVotes: number;

  @ApiProperty()
  @Prop()
  points: number;

  @ApiProperty()
  @Prop()
  rank: number;

  @ApiProperty()
  @Prop()
  date: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication)
