import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { MetaData } from '../models/MetaData'
import { ApiProperty } from '@nestjs/swagger'

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @ApiProperty()
  @Prop()
  imageLink: string;

  @ApiProperty()
  @Prop()
  pseudo: string;

  @ApiProperty()
  @Prop()
  metaDatas: MetaData;

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

export const PostSchema = SchemaFactory.createForClass(Post)
