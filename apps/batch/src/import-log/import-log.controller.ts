import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { ImportLogTypeInDto } from './dto/import-log-type-in.dto';
import { ImportLogService } from './import-log.service';

@ApiTags('import log')
@Controller('batch/import-log')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('network')
export class ImportLogController {
  constructor(private readonly importLogService: ImportLogService) {}

  @Post('/topic-type')
  @ApiResponseEntity({ summary: 'import log' })
  async dspImportEventLog(
    @Body() importLogTypeInDto: ImportLogTypeInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.importLogService.importLog(
      importLogTypeInDto.toBlockNumber,
      importLogTypeInDto.topicType,
    );

    return ResponseEntity.ok().build();
  }
}
