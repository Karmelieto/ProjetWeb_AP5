import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Reward } from '../models/Reward'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../models/UserRole'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: number;

  @ApiProperty()
  @Prop()
  pseudo: string;

  @ApiProperty()
  @Prop()
  mail: string;

  @ApiProperty()
  @Prop()
  profileImageLink: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  userRole: UserRole;

  @ApiProperty()
  @Prop()
  favorisPosts: number[];

  @ApiProperty()
  @Prop([Reward])
  rewards: Reward[];
}

export const UserSchema = SchemaFactory.createForClass(User)
