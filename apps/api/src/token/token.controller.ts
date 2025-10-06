import { Controller, Get, Head, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { TokenService } from './token.service';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
  ) {}

  @Head('dsp/character/:token_id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headShapesMetadata(@Param('token_id') tokenId: number): void {}

  @Get('dsp/character/:token_id')
  @ApiResponseEntity({ summary: 'shapes metadata-form json' })
  async getShapesMetadata(@Param('token_id') tokenId: number) {

  }

  // @Head('dsp/gacha-ticket/:token_id')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // headDspGachaTicketMetadata(@Param('token_id') tokenId: number): void {}
  //
  // @Get('dsp/gacha-ticket/:token_id')
  // @ApiResponseEntity({ summary: 'dsp gacha-ticket metadata-form json' })
  // async getDspGachaTicketMetadata(@Param('token_id') tokenId: number) {
  //   return await this.externalService.getDspGachaTicketMetadata(tokenId);
  // }
}
