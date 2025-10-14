import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { Erc721Service } from './erc721.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';

@ApiTags('erc721')
@Controller('batch/erc721')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('network')
export class Erc721Controller {
  constructor(private readonly erc721Service: Erc721Service) {}

  @Post('transfer/owner')
  @ApiResponseEntity({ summary: 'owner 변경' })
  async transferOwner(): Promise<ResponseEntity<unknown>> {
    await this.erc721Service.transferOwner();

    return ResponseEntity.ok().build();
  }

  @Post('shape/gacha')
  @ApiResponseEntity({ summary: '도형 가챠' })
  async shapeGacha(): Promise<ResponseEntity<unknown>> {
    await this.erc721Service.shapeGacha();

    return ResponseEntity.ok().build();
  }

  @Post('shape/set-shape-id')
  @ApiResponseEntity({ summary: '도형 id 주입' })
  async setShapeId(): Promise<ResponseEntity<unknown>> {
    await this.erc721Service.setShapeId();

    return ResponseEntity.ok().build();
  }
}
