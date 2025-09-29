import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

export class AuthSignUserOutDto extends UserDto {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  sessionId: string;

  constructor(partial: Partial<AuthSignUserOutDto>) {
    super();
    Object.assign(this, partial);
  }

  setAuthToken(authToken: string): this {
    this.authToken = authToken;
    return this;
  }

  setRefreshToken(refreshToken: string): this {
    this.refreshToken = refreshToken;
    return this;
  }

  setSessionId(sessionId: string): this {
    this.sessionId = sessionId;
    return this;
  }

  static of(user: User): AuthSignUserOutDto {
    return plainToInstance(AuthSignUserOutDto, instanceToPlain(user));
  }
}
