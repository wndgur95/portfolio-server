import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { TransactionInDto } from './dto/transaction-in.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { Auth } from '../auth/decorator/auth.decorator';
import { UserLevelLockInDto } from './dto/user-level-lock-in.dto';
import { RowLevelLockInDto } from './dto/row-level-lock-in.dto';

@ApiTags('database')
@Controller('api/database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('transaction')
  @ApiResponseEntity({
    summary: '트랜잭션 확인하기',
  })
  @Auth()
  @UserLevelLock()
  async testTransaction(
    @Body() transactionInDto: TransactionInDto,
  ): Promise<ResponseEntity<string>> {
    await this.databaseService.testTransaction(transactionInDto);

    return ResponseEntity.ok().body('업데이트 성공');
  }

  @Post('user-level-lock')
  @ApiResponseEntity({
    summary: '락 네임드 락 확인하기',
  })
  @Auth()
  @UserLevelLock()
  async testUserLevelLock(
    @Body() userLevelLockInDto: UserLevelLockInDto,
  ): Promise<ResponseEntity<number>> {
    const goodsOutDto = await this.databaseService.testUserLevelLock(
      userLevelLockInDto.addGold,
    );

    return ResponseEntity.ok().body(goodsOutDto.currency.gold);
  }

  @Post('user-level-unlock')
  @ApiResponseEntity({
    summary: '언락 네임드 락 확인하기',
  })
  @Auth()
  async testUserLevelUnlock(
    @Body() userLevelLockInDto: UserLevelLockInDto,
  ): Promise<ResponseEntity<number>> {
    const goodsOutDto = await this.databaseService.testUserLevelLock(
      userLevelLockInDto.addGold,
    );

    return ResponseEntity.ok().body(goodsOutDto.currency.gold);
  }

  @Post('row-level-lock')
  @ApiResponseEntity({
    summary: '락 행 락 확인하기',
  })
  async testRowLevelLock(
    @Body() rowLevelLockInDto: RowLevelLockInDto,
  ): Promise<ResponseEntity<number>> {
    const testTable =
      await this.databaseService.testRowLevelLock(rowLevelLockInDto);

    return ResponseEntity.ok().body(testTable.count);
  }

  @Post('row-level-unlock')
  @ApiResponseEntity({
    summary: '언락 행 락 확인하기',
  })
  async testRowLevelUnlock(
    @Body() rowLevelLockInDto: RowLevelLockInDto,
  ): Promise<ResponseEntity<number>> {
    const testTable = await this.databaseService.testRowLevelUnlock(
      rowLevelLockInDto
    );

    return ResponseEntity.ok().body(testTable.count);
  }
}
