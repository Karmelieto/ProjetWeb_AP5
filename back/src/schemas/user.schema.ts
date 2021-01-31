import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Reward } from '../models/Reward'
import * as mongoose from 'mongoose'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: number;

  @Prop()
  pseudo: string;

  @Prop()
  mail: string;

  @Prop()
  profileImageLink: string;

  @Prop()
  description: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  favorisPosts: number[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }] })
  rewards: Reward[];
}

export const UserSchema = SchemaFactory.createForClass(User)
