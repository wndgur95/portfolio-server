import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class GetContractOutDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsArray()
  abi: any[];

  constructor(partial?: Partial<GetContractOutDto>) {
    Object.assign(this, partial);
  }

  static of(address: string, abi: any[]): GetContractOutDto {
    return new GetContractOutDto({
      address: address,
      abi: abi,
    });
  }
}
