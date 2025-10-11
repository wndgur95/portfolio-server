import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AirdropService } from './airdrop.service';
import { JwtWeb3Guard } from '../auth/guard/jwt-web3.guard';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { Erc1155ProofInDto } from './dto/erc1155-proof-in.dto';
import { Erc1155ClaimOutDto } from './dto/erc1155-claim-out.dto';

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

  @Post('erc1155/proof')
  @ApiResponseEntity({
    summary: 'erc1155 에어드랍 큐 등록',
  })
  async erc1155ClaimRegister(
    @Body() erc1155ProofInDto: Erc1155ProofInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.airdropService.erc1155ClaimRegister(erc1155ProofInDto);

    return ResponseEntity.ok().build();
  }

  @Get('erc1155/claim')
  @ApiResponseEntity({
    summary: 'erc1155 claim 정보 받기',
  })
  async erc1155Claim(): Promise<ResponseEntity<Erc1155ClaimOutDto[]>> {
    const erc1155ClaimOutDto = await this.airdropService.erc1155Claim();

    return ResponseEntity.ok().body(erc1155ClaimOutDto);
  }
}
