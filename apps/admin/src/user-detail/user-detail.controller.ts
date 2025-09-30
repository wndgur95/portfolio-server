import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { UserDetailService } from './user-detail.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { GetUserDetailOutDto } from './dto/get-user-detail-out.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('UserDetail')
@Controller('admin/user-detail')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiSecurity('selected-user-id')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @Get('')
  @ApiOperation({
    summary: '유저 상세 목록 조회',
    description: '유저 상세 정보를 반환합니다.',
  })
  async getUserDetail(): Promise<ResponseEntity<GetUserDetailOutDto>> {
    const getUserDetailOutDto = await this.userDetailService.getUserDetail();

    return ResponseEntity.ok().body(getUserDetailOutDto);
  }
}
