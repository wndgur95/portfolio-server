import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetSoloRankingInDto {
  @ApiProperty({
    description: '시작 랭킹',
    required: false,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  startRank?: number;

  @ApiProperty({
    description: '조회할 랭킹 개수',
    required: false,
    default: 30,
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  count?: number;
}
