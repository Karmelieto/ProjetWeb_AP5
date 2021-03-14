import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class LoginUserDto {
  @Transform((newPseudo) => newPseudo.value.toLowerCase())
  @IsEmail()
  @ApiProperty()
  mail: string;

  @ApiProperty()
  password: string;
}
