import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { AirdropService } from './airdrop.service';

@ApiTags('airdrop')
@Controller('batch/airdrop')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('network')
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  @Post('coin')
  @ApiResponseEntity({ summary: '코인 에어드랍' })
  async airdropCoin(): Promise<ResponseEntity<unknown>> {
    await this.airdropService.airdropCoin();

    return ResponseEntity.ok().build();
  }
}
