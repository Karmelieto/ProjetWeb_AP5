import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Reward } from '../models/Reward'
import { IsEmail } from 'class-validator'

export type UserDocument = User & Document;

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
  favorites: number[];

  @Prop()
  rewards: Reward[];
}

export const UserSchema = SchemaFactory.createForClass(User)
