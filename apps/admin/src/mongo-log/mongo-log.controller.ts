import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { MongoLogService } from './mongo-log.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetMongoLogsOutDto } from '@libs/common/dto/get-mongo-logs-out.dto';
import { GetMongoLogsInDto } from '@libs/common/dto/get-mongo-logs-in.dto';

@ApiTags('mongo-log')
@Controller('admin/mongo-log')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class MongoLogController {
  constructor(private readonly mongoLogService: MongoLogService) {}

  @Get('')
  @ApiResponseEntity({
    summary: '몽고 로그 컬렉션 조회',
  })
  async getMongoLogCollection(): Promise<ResponseEntity<string[]>> {
    const collections = this.mongoLogService.getMongoLogCollection();

    return ResponseEntity.ok().body(collections);
  }

  @Post('search')
  @ApiResponseEntity({
    type: GetMongoLogsOutDto,
    isPagination: true,
    summary: '몽고 로그 조회',
  })
  async getMongoLogs(
    @Body() getMongoLogsInDto: GetMongoLogsInDto,
  ): Promise<ResponseEntity<GetMongoLogsOutDto>> {
    const getMongoLogsOutDto =
      await this.mongoLogService.getMongoLog(getMongoLogsInDto);

    return ResponseEntity.ok().body(getMongoLogsOutDto);
  }
}
