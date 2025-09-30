import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { MissionFilterDto } from './dto/mission-filter.dto';
import { QueryFilter } from '../decorator/query-filter.decorator';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';
import { MissionService } from './mission.service';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

@ApiTags('Mission')
@Controller('admin/mission')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiSecurity('selected-user-id')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('')
  @ApiOperation({
    summary: '유저 미션 조회',
    description: '유저 미션 정보를 반환합니다.',
  })
  @ApiQuery({ name: 'filter', type: MissionFilterDto, required: false })
  async getMissions(
    @QueryFilter() paginationDto: PaginationInDto<MissionFilterDto>,
  ): Promise<ResponseEntity<Mission[]>> {
    const [missions, paginationOutDto] =
      await this.missionService.getMissions(paginationDto);

    return ResponseEntity.ok().pagination(paginationOutDto).body(missions);
  }
}
