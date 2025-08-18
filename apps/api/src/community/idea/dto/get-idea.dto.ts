import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetIdeaOutDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;

  @ApiProperty()
  doItCount: number;
}
