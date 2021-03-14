import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @Transform((lastPseudo) => lastPseudo.value.toLowerCase())
  @ApiProperty()
  lastPseudo: string;

  @Transform((newPseudo) => newPseudo.value.toLowerCase())
  @ApiProperty()
  newPseudo: string;

  @Transform((pseudoUserConnected) => pseudoUserConnected.value.toLowerCase())
  @ApiProperty()
  pseudoUserConnected: string;

  @ApiProperty()
  profileImageLink: string;

  @ApiProperty()
  description: string;
}
