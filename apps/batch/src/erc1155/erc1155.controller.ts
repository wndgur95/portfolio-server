import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { Erc1155Service } from './erc1155.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';

@ApiTags('erc1155')
@Controller('batch/erc1155')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
@ApiBearerAuth('network')
export class Erc1155Controller {
  constructor(private readonly erc1155Service: Erc1155Service) {}

  @Post('merkle-tree/make')
  @ApiResponseEntity({ summary: 'merkle tree 생성' })
  async makeMerkleTree(): Promise<ResponseEntity<unknown>> {
    await this.erc1155Service.makeMerkleTree();

    return ResponseEntity.ok().build();
  }

  @Post('merkle-tree/set')
  @ApiResponseEntity({ summary: 'merkle tree 생성' })
  async setMerkleTree(): Promise<ResponseEntity<unknown>> {
    await this.erc1155Service.setMerkleTree();

    return ResponseEntity.ok().build();
  }
}
