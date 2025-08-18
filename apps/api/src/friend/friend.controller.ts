import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@libs/common/decorator/current-user.decorator';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { UserLevelLock } from '@libs/common/decorator/user-level-lock.decorator';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDto } from '@libs/dao/common/users/dto/user.dto';
import { RequestFriendInDto } from './dto/request-friend.dto';
import { RequestResultFriendInDto } from './dto/request-result-friend.dto';
import { GetFriendOutDto } from './dto/get-friend.dto';

@ApiTags('friend')
@Controller('friend')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @ApiResponseEntity({
    type: UserDto,
    summary: '내 친구 정보',
  })
  async getFriend(
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<GetFriendOutDto[]>> {
    const getFriendOutDto = await this.friendService.getFriend(user.id);

    return ResponseEntity.ok().body(getFriendOutDto);
  }

  @Post('request')
  @ApiResponseEntity({
    type: UserDto,
    summary: '친구 요청',
  })
  @UserLevelLock()
  async requestFriend(
    @CurrentUser() user: User,
    @Body() requestFriendInDto: RequestFriendInDto,
  ): Promise<ResponseEntity<GetFriendOutDto>> {
    const getFriendOutDto = await this.friendService.requestFriend(
      user,
      requestFriendInDto,
    );

    return ResponseEntity.ok().body(getFriendOutDto);
  }

  @Post('request/result')
  @ApiResponseEntity({
    type: UserDto,
    summary: '친구 요청 결과',
  })
  @UserLevelLock()
  async requestResultFriend(
    @CurrentUser() user: User,
    @Body() requestResultFriendInDto: RequestResultFriendInDto,
  ): Promise<ResponseEntity<GetFriendOutDto>> {
    const getFriendOutDto = await this.friendService.requestResultFriend(
      user,
      requestResultFriendInDto,
    );

    return ResponseEntity.ok().body(getFriendOutDto);
  }

  @Delete('delete/:id')
  @ApiResponseEntity({
    summary: '친구 삭제',
  })
  @UserLevelLock()
  async deleteFriend(
    @CurrentUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseEntity<unknown>> {
    await this.friendService.deleteFriend(user, Number(id));

    return ResponseEntity.ok().build();
  }
}
