import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AirdropService } from './airdrop.service';
import { JwtWeb3Guard } from '../auth/guard/jwt-web3.guard';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';

@ApiTags('airdrop')
@Controller('api/airdrop')
@UseGuards(JwtWeb3Guard)
@ApiBearerAuth('jwt-web3')
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  @Post('coin/queue')
  @ApiResponseEntity({
    summary: '코인 에어드랍 큐 등록',
  })
  async airdropCoinQueueRegister(): Promise<ResponseEntity<unknown>> {
    await this.airdropService.airdropCoinQueueRegister();

    return ResponseEntity.ok().build();
  }
}
