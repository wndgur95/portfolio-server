import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';

export class AuthSignUserInDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  static toEntity(dto: AuthSignUserInDto): UserEntity {
    return UserEntity.create(dto);
  }
}
