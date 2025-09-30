import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MongoLogService } from './mongo-log.service';
import { CreateMongoLogInDto } from './dto/create-mongo-log-in.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { NfTokenGuard } from '../auth/guard/nf-token.guard';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { GetMongoLogsOutDto } from '@libs/common/dto/get-mongo-logs-out.dto';
import { GetMongoLogsInDto } from '@libs/common/dto/get-mongo-logs-in.dto';

@Controller('log/mongo')
@ApiTags('Mongo')
export class MongoLogController {
  constructor(private readonly mongoLogService: MongoLogService) {}

  @Post()
  @ApiResponseEntity({ summary: '공통 로그' })
  @UseGuards(NfTokenGuard)
  @ApiSecurity('nfToken')
  async setLog(
    @Body() createMongoLogInDto: CreateMongoLogInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.mongoLogService.setMongoLog(createMongoLogInDto);

    return ResponseEntity.ok().build();
  }

  @Post('search')
  @ApiResponseEntity({
    type: GetMongoLogsOutDto,
    isPagination: true,
    summary: '몽고 로그 조회',
  })
  @UseGuards(NfTokenGuard)
  @ApiSecurity('nfToken')
  async getMongoLogs(
    @Body() getMongoLogsInDto: GetMongoLogsInDto,
  ): Promise<ResponseEntity<GetMongoLogsOutDto>> {
    const getMongoLogsOutDto =
      await this.mongoLogService.getMongoLog(getMongoLogsInDto);

    return ResponseEntity.ok().body(getMongoLogsOutDto);
  }
}
