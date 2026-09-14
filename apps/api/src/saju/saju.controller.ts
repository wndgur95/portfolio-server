import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SajuService } from './saju.service';
import { AnalyzeSajuInDto } from './dto/analyze-saju.dto';

@ApiTags('saju')
@Controller('api/saju')
export class SajuController {
  constructor(private readonly sajuService: SajuService) {}

  @Post('analyze')
  @ApiOperation({ summary: '사주 분석 및 결과 저장 (shareKey 발급)' })
  async analyze(@Body() dto: AnalyzeSajuInDto) {
    return await this.sajuService.analyzeAndSave(dto);
  }

  @Get('result/:shareKey')
  @ApiOperation({ summary: '공유 키(shareKey)로 사주 결과 조회' })
  async getResult(@Param('shareKey') shareKey: string) {
    return await this.sajuService.getResultByShareKey(shareKey);
  }

  @Get('stats')
  @ApiOperation({ summary: '사주 서비스 통계 조회' })
  async getStats() {
    return await this.sajuService.getStats();
  }
}
