import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthCramOutDto {
  @ApiProperty()
  @IsString()
  challenge: string;

  setChallenge(challenge: string): this {
    this.challenge = challenge;
    return this;
  }

  static of(): AuthCramOutDto {
    return new AuthCramOutDto();
  }
}
