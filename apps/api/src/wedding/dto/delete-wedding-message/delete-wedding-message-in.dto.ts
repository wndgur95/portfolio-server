import { ApiProperty } from '@nestjs/swagger';

export class DeleteWeddingMessageInDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  command: string;
}
