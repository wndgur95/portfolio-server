import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123'
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '디바이스 정보 (선택사항)',
    example: 'iPhone 14, iOS 16.0',
    required: false
  })
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @ApiProperty({
    description: '로그인 위치 (선택사항)',
    example: 'Seoul, Korea',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;
} 