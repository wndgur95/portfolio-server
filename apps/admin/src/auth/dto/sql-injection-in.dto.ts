import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SqlInjectionInDto {
  @ApiProperty({ 
    description: 'SQL 인젝션 테스트용 입력 내용',
    example: "'; DROP TABLE sql_injection; --"
  })
  @IsString()
  @IsNotEmpty()
  contents: string;
}
