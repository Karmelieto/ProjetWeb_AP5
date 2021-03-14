import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Reward } from '../models/Reward'
import { IsEmail } from 'class-validator'

@Schema()
export class User {
  @Prop()
  pseudo: string;

  @Prop()
  password: string;

  @Prop()
  @IsEmail()
  mail: string;

  @Prop()
  profileImageLink: string;

  @Prop()
  description: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  favorites: string[];

  @Prop()
  rewards: Reward[];

  @Prop()
  token: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User)
