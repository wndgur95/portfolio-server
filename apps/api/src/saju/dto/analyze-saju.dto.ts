import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export enum SajuCategory {
  FRUIT = 'fruit',
  DESSERT = 'dessert',
  DRINK = 'drink',
}

export class AnalyzeSajuInDto {
  @ApiProperty({ description: '사주 카테고리 (fruit | dessert | drink)', enum: SajuCategory, example: 'dessert' })
  @IsEnum(SajuCategory)
  @IsNotEmpty()
  category: SajuCategory;

  @ApiProperty({ description: '이름 또는 닉네임', example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({ description: '태어난 년도 (양력)', example: 1995 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ description: '태어난 월 (1~12)', example: 8 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: '태어난 일 (1~31)', example: 15 })
  @IsInt()
  @Min(1)
  @Max(31)
  day: number;

  @ApiProperty({ description: '태어난 시간 인덱스 (0~11, 모르면 -1)', example: 6, default: -1 })
  @IsInt()
  @Min(-1)
  @Max(11)
  @IsOptional()
  hourIndex: number = -1;

  @ApiProperty({ description: '성별 (female | male)', example: 'male' })
  @IsEnum(['female', 'male'])
  gender: 'female' | 'male' = 'female';
}
