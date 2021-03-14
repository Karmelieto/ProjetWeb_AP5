import { ApiProperty } from '@nestjs/swagger';

export class Reward {
  @ApiProperty()
  postId: number;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  points: number;
}
