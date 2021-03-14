import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class ChangeFavoriteOfUserDto {
  @Transform((pseudo) => pseudo.value.toLowerCase())
  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  idPost: string;
}
