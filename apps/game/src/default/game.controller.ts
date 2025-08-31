import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.gameService.health());
  }
}
