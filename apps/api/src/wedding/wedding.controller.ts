import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { GetWeddingMessageInDto } from './dto/get-wedding-messages/get-wedding-message-in.dto';
import { WeddingService } from './wedding.service';
import { GetWeddingMessageOutDto } from './dto/get-wedding-messages/get-wedding-message-out.dto';
import { CreateWeddingMessageInDto } from './dto/create-wedding-message/create-wedding-message-in.dto';
import { DeleteWeddingMessageInDto } from './dto/delete-wedding-message/delete-wedding-message-in.dto';
import { MakeRouletteInDto } from './dto/make-roulette/make-roulette-in.dto';
import { RouletteDto } from '@libs/dao/wedding/roulettes/dto/roulette.dto';

@ApiTags('wedding')
@Controller('wedding')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class WeddingController {
  constructor(private readonly weddingService: WeddingService) {}

  @Get('messages/get')
  @ApiResponseEntity({
    type: GetWeddingMessageOutDto,
    isArray: true,
    summary: '메세지 가져오기',
  })
  async getWeddingMessages(
    @Query() getWeddingMessageInDto: GetWeddingMessageInDto,
  ): Promise<ResponseEntity<GetWeddingMessageOutDto>> {
    const [weddingMessages, pageMetaDto] =
      await this.weddingService.getWeddingMessage(getWeddingMessageInDto);

    return ResponseEntity.ok()
      .body(GetWeddingMessageOutDto.of({ weddingMessages: weddingMessages }))
      .setPageMeta(pageMetaDto);
  }

  @Post('messages/create')
  @ApiResponseEntity({
    type: GetWeddingMessageOutDto,
    isArray: true,
    summary: '메세지 생성',
  })
  async createWeddingMessages(
    @Body() createWeddingMessageInDto: CreateWeddingMessageInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.weddingService.createWeddingMessage(createWeddingMessageInDto);

    return ResponseEntity.ok().build();
  }

  @Post('messages/delete')
  @ApiResponseEntity({
    summary: '메세지 삭제',
  })
  async deleteWeddingMessage(
    @Body() deleteWeddingMessageInDto: DeleteWeddingMessageInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.weddingService.deleteWeddingMessage(deleteWeddingMessageInDto);

    return ResponseEntity.ok().build();
  }

  @Get('roulette')
  @ApiResponseEntity({
    summary: '룰렛 판',
  })
  async getRoulette(): Promise<ResponseEntity<RouletteDto>> {
    return ResponseEntity.ok().body(await this.weddingService.getRoulette());
  }

  @Post('make/roulette')
  @ApiResponseEntity({
    summary: '룰렛 판 만들기',
  })
  async makeRoulette(
    @Body() makeRouletteInDto: MakeRouletteInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.weddingService.makeRoulette(makeRouletteInDto);

    return ResponseEntity.ok().build();
  }

  @Post('random/roulette')
  @ApiResponseEntity({
    summary: '룰렛 판 뽑기',
  })
  async randomRoulette(): Promise<ResponseEntity<number>> {
    return ResponseEntity.ok().body(await this.weddingService.randomRoulette());
  }
}
