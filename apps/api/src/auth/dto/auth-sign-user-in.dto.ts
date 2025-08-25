import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';

export class AuthSignUserInDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  static toEntity(dto: AuthSignUserInDto): UserEntity {
    return UserEntity.create(dto);
  }
}
