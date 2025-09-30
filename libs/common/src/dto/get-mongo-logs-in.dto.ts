import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { GameCode } from '@libs/common/constants/environment.constants';
import { IsOptional, IsString } from 'class-validator';

export class GetMongoLogsInDto extends PageOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  gameCode?: GameCode;

  @ApiProperty()
  @IsString()
  collectionName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nid?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  startAt?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  endAt?: string;
}
