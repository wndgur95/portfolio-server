import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DatabaseService } from './database.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { TransactionInDto } from './dto/transaction-in.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';

@ApiTags('database')
@Controller('database')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('transaction')
  @ApiResponseEntity({
    summary: '트랜잭션 확인하기',
  })
  @UserLevelLock()
  async testTransaction(
    @Body() transactionInDto: TransactionInDto,
  ): Promise<ResponseEntity<string>> {
    await this.databaseService.testTransaction(transactionInDto);

    return ResponseEntity.ok().body('업데이트 성공');
  }
}
