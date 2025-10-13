import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { Erc721Service } from './erc721.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';

@ApiTags('erc1155')
@Controller('batch/erc1155')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('network')
export class Erc721Controller {
  constructor(private readonly erc721Service: Erc721Service) {}

  @Post('transfer/owner')
  @ApiResponseEntity({ summary: 'real owner 변경' })
  async transferRealOwner(): Promise<ResponseEntity<unknown>> {
    await this.erc721Service.transferOwner();

    return ResponseEntity.ok().build();
  }
}
