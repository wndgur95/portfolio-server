import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { Auth } from '../auth/decorator/auth.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ShopService } from './shop.service';
import { GachaInDto } from './dto/gacha-in.dto';
import { GachaOutDto } from './dto/gacha-out.dto';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';

@Controller('game/shop')
@ApiTags('Shop')
@Auth()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('gacha')
  @ApiResponseEntity({
    type: GachaOutDto,
    summary: '가챠',
  })
  @UserLevelLock()
  async gacha(@Body() gachaInDto: GachaInDto): Promise<ResponseEntity<GachaOutDto>> {
    const gachaOutDto = await this.shopService.gacha(gachaInDto);

    return ResponseEntity.ok().body(gachaOutDto);
  }
}
