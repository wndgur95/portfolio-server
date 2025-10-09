import { Controller, Get } from '@nestjs/common';
import { BatchService } from './batch.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.batchService.health());
  }
}
