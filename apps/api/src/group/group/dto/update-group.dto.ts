import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { Group } from '@libs/dao/common/groups/interfaces/group.interface';

export class UpdateGroupInDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty()
  image?: string;
}

export class UpdateGroupOutDto extends BaseOutDto {
  @ApiProperty()
  group: Group;
}
