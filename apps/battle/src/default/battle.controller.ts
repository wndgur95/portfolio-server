import { Controller, Get } from '@nestjs/common';
import { BattleService } from './battle.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.battleService.health());
  }
}
