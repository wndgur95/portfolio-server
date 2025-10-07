import { Controller, Get, Head, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { TokenService } from './token.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('token')
@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Head('shape/:tokenId')
  headShapeMetadata(): void {}

  @Get('shape/:tokenId')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 1000 } }) // 1초에 2번 허용
  @ApiResponseEntity({ summary: 'shapes metadata-form json' })
  async getShapeMetadata(@Param('tokenId') tokenId: number): Promise<unknown> {
    return await this.tokenService.getShapeMetadata(Number(tokenId));
  }

  @Head('number/:tokenId')
  headNumberMetadata(): void {}

  @Get('number/:tokenId')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 1000 } }) // 1초에 2번 허용
  @ApiResponseEntity({ summary: 'number metadata-form json' })
  async getNumberMetadata(@Param('tokenId') tokenId: number): Promise<unknown> {
    return await this.tokenService.getNumberMetadata(Number(tokenId));
  }

  @Head('gacha/:tokenId')
  headGachaMetadata(): void {}

  @Get('gacha/:tokenId')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 1000 } }) // 1초에 2번 허용
  @ApiResponseEntity({ summary: 'gacha metadata-form json' })
  async getGachaMetadata(@Param('tokenId') tokenId: number): Promise<unknown> {
    return await this.tokenService.getGachaMetadata(Number(tokenId));
  }
}
