import { ApiProperty } from '@nestjs/swagger';

export class CreateWeddingMessageInDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  context: string;
}
