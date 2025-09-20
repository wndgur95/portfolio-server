import { Controller, Get } from '@nestjs/common';
import { SocketService } from './socket.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('socket')
export class SocketController {
  constructor(private readonly battleService: SocketService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.battleService.health());
  }
}
