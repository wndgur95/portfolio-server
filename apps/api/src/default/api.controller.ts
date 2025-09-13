import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.apiService.health());
  }
}
