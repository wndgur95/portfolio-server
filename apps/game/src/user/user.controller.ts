import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { UserService } from './user.service';
import { GetUserOutDto } from './dto/get-user-out.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@ApiTags('user')
@Controller('game/user')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('get')
  @ApiResponseEntity({
    type: GetUserOutDto,
    summary: '유저 정보 가져오기',
  })
  async getUser(): Promise<ResponseEntity<GetUserOutDto>> {
    const getUserOutDto = await this.userService.getUser();

    return ResponseEntity.ok().body(getUserOutDto);
  }
}
