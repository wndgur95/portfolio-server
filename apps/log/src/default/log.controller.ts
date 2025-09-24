import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.logService.health());
  }
}
