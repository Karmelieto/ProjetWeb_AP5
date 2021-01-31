import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Reward } from '../models/Reward'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  pseudo: string;

  @Prop()
  password: string;

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

  @Prop()
  rewards: Reward[];
}

export const UserSchema = SchemaFactory.createForClass(User)
