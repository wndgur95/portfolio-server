import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, Min } from 'class-validator';

class SelectedCurrencyDto {
  @ApiProperty()
  @IsNumber()
  dataCurrencyId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class GoodsInDto {
  @ApiPropertyOptional({
    type: SelectedCurrencyDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  currencies?: SelectedCurrencyDto[];
}
