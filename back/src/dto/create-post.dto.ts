import { Reward } from '../models/Reward'

export class CreateUserDto {
  _id: number;
  pseudo: string;
  mail: string;
  profileImageLink: string;
  description: string;
  isAdmin: boolean;
  favorisPosts: number[];
  rewards: Reward[];
}
