import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserFilterDto } from './dto/user-filter.dto';
import { QueryFilter } from '../decorator/query-filter.decorator';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';

@ApiTags('user')
@Controller('admin/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '유저 목록 조회',
    description: '유저 정보를 페이징네이션해서 반환합니다.',
  })
  @ApiQuery({ name: 'filter', type: UserFilterDto, required: false })
  async getUsers(
    @QueryFilter() paginationDto: PaginationInDto<UserFilterDto>,
  ): Promise<ResponseEntity<any>> {
    const [users, paginationOutDto] =
      await this.userService.getUsers(paginationDto);

    return ResponseEntity.ok().pagination(paginationOutDto).body(users);
  }
}
