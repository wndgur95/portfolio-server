import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TokenService } from './token.service';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../../../api/src/auth/role/role.decorator';
import { USER_ROLES } from '@libs/common/constants/role.constants';

@ApiTags('Token')
@Controller('admin/token')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth('jwt')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('shape-data/get')
  @ApiOperation({
    summary: '도형 데이터 컨트렉트 확인',
  })
  async getShapeData(): Promise<ResponseEntity<unknown>> {
    return ResponseEntity.ok().body(await this.tokenService.getShapeData());
  }

  @Post('shape-data/set')
  @ApiOperation({
    summary: '도형 데이터 컨트렉트 주입',
  })
  @Roles(USER_ROLES.SUPER)
  async setShapeData(): Promise<ResponseEntity<unknown>> {
    await this.tokenService.setShapeData();

    return ResponseEntity.ok().build();
  }

  @Post('number-data/get')
  @ApiOperation({
    summary: '숫자 데이터 컨트렉트 확인',
  })
  async getNumberData(): Promise<ResponseEntity<unknown>> {
    return ResponseEntity.ok().body(await this.tokenService.getNumberData());
  }

  @Post('number-data/set')
  @ApiOperation({
    summary: '숫자 데이터 컨트렉트 주입',
  })
  @Roles(USER_ROLES.SUPER)
  async setNumberData(): Promise<ResponseEntity<unknown>> {
    await this.tokenService.setNumberData();

    return ResponseEntity.ok().build();
  }

  @Post('gacha-data/get')
  @ApiOperation({
    summary: '가챠 데이터 컨트렉트 확인',
  })
  async getGachaData(): Promise<ResponseEntity<unknown>> {
    return ResponseEntity.ok().body(await this.tokenService.getGachaData());
  }

  @Post('gacha-data/set')
  @ApiOperation({
    summary: '가챠 데이터 컨트렉트 주입',
  })
  @Roles(USER_ROLES.SUPER)
  async setGachaData(): Promise<ResponseEntity<unknown>> {
    await this.tokenService.setGachaData();

    return ResponseEntity.ok().build();
  }
}
