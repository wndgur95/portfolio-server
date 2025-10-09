import { Controller, Get } from '@nestjs/common';
import { JobService } from './job.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.jobService.health());
  }
}
