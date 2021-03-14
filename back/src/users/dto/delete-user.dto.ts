import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DeleteUserDto {
  @Transform((pseudo) => pseudo.value.toLowerCase())
  @ApiProperty()
  pseudo: string;

  @Transform((pseudoUserConnected) => pseudoUserConnected.value.toLowerCase())
  @ApiProperty()
  pseudoUserConnected: string;
}
