import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Tag {
  @Prop()
  name: string;

  @Prop()
  imageLink: string;

  @Prop()
  isPrivate: boolean;

  @Prop()
  usersAllow: string[];
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag)
