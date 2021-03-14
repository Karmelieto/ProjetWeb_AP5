import { ApiProperty } from '@nestjs/swagger'

export class DeletePublicationDto {
  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  token: string;
}
