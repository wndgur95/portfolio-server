import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
  Min,
  Max,
  IsIn,
  IsUrl,
  IsDateString,
  IsArray,
  ValidateNested,
  IsObject,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConstantsValidator } from '@libs/common/validator/constants.validator';
import { constToString } from '@libs/common/utils/constants.util';

export class NestedObjectDto {
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  string: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  number: number;
}

export const VALIDATION_CONST_ENUM = {
  None: 0,
  Test: 1,
  Live: 2,
};
export type ValidationConstEnum =
  (typeof VALIDATION_CONST_ENUM)[keyof typeof VALIDATION_CONST_ENUM];

export class ValidationInDto {
  // 기본 문자열 검증
  @ApiProperty({ description: '기본 문자열 (1-50자)' })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  string?: string;

  // 이메일 검증
  @ApiProperty({ description: '이메일 형식' })
  @IsEmail()
  @IsOptional()
  email?: string;

  // 숫자 검증
  @ApiProperty({ description: '양수 (1-100)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  number?: number;

  // 불린 검증
  @ApiProperty({ description: '불린 값' })
  @IsBoolean()
  @IsOptional()
  boolean?: boolean;

  // URL 검증
  @ApiProperty({ description: 'URL 형식', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  // 날짜 문자열 검증
  @ApiProperty({ description: '날짜 문자열 (ISO)', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  // 열거형 검증
  @ApiProperty({ description: '역할 선택', enum: ['ADMIN', 'USER', 'GUEST'] })
  @IsIn(['ADMIN', 'USER', 'GUEST'])
  @IsOptional()
  in?: string;

  // const 이넘
  @ApiProperty({
    description: constToString(VALIDATION_CONST_ENUM, 'VALIDATION_CONST_ENUM'),
  })
  @IsNumber()
  @IsOptional()
  @Validate(ConstantsValidator, [VALIDATION_CONST_ENUM])
  constEnum?: ValidationConstEnum;

  // 배열 검증
  @ApiProperty({ description: '문자열 배열', type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Length(1, 20, { each: true })
  array?: string[];

  // 중첩 객체 검증
  @ApiProperty({ description: '중첩 객체', type: NestedObjectDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => NestedObjectDto)
  object?: NestedObjectDto;

  // 중첩 객체 배열 검증
  @ApiProperty({ description: '중첩 객체 배열', type: [NestedObjectDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NestedObjectDto)
  objectArray?: NestedObjectDto[];
}
