import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtWeb3Guard } from '../auth/guard/jwt-web3.guard';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { NftService } from './nft.service';
import { GetGachaTokenOutDto } from './dto/get-gacha-token-out.dto';
import { GetNumberTokenOutDto } from './dto/get-number-token-out.dto';
import { GetShapeTokenOutDto } from './dto/get-shape-token-out.dto';

@ApiTags('nft')
@Controller('api/nft')
@ApiBearerAuth('jwt-web3')
@UseGuards(JwtWeb3Guard)
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('shape')
  @ApiResponseEntity({
    summary: '도형 토큰 정보 받기',
  })
  async getShapeToken(): Promise<ResponseEntity<GetShapeTokenOutDto>> {
    const getShapeTokenOutDto = await this.nftService.getShapeTokens();

    return ResponseEntity.ok().body(getShapeTokenOutDto);
  }

  @Get('gacha')
  @ApiResponseEntity({
    summary: '가챠 토큰 정보 받기',
  })
  async getGachaToken(): Promise<ResponseEntity<GetGachaTokenOutDto>> {
    const getGachaTokenOutDto = await this.nftService.getGachaTokens();

    return ResponseEntity.ok().body(getGachaTokenOutDto);
  }

  @Get('number')
  @ApiResponseEntity({
    summary: '숫자 토큰 정보 받기',
  })
  async getNumberToken(): Promise<ResponseEntity<GetNumberTokenOutDto>> {
    const getNumberTokenOutDto = await this.nftService.getNumberTokens();

    return ResponseEntity.ok().body(getNumberTokenOutDto);
  }
}
