import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class AuthSignUserInDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Qwer1234!!' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
