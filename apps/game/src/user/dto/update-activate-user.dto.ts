import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class UpdateActivateUserDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  activate: boolean;
}
