import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ContactDto {
  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '이메일', example: 'example@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '제목', example: '프로젝트 협업 문의' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  subject: string;

  @ApiProperty({ description: '메시지 내용', example: '안녕하세요! 프로젝트 협업에 관심이 있어서 연락드립니다.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  message: string;
} 