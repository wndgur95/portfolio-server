import { ApiProperty } from '@nestjs/swagger';

export class SqlInjectionResultDto {
  @ApiProperty({ description: '입력된 내용' })
  inputContents: string;

  @ApiProperty({ description: '실행된 실제 쿼리' })
  executedQuery: string;

  @ApiProperty({ description: '쿼리 파라미터' })
  parameter: string;

  @ApiProperty({ description: '방어 결과 메시지' })
  defenseMessage: string;

  @ApiProperty({ description: 'TypeORM 보안 효과' })
  securityEffect: string;
} 