import { Inject, Injectable } from '@nestjs/common';
import {
  Transactional,
  TransactionalEx,
} from '@libs/common/decorator/transaction.decorator';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { RequestFriendInDto } from './dto/request-friend.dto';
import { FriendsDbRepositories } from '@libs/dao/user/friends/repositories/friends-db.repository';
import { FriendsRepository } from '@libs/dao/user/friends/interfaces/friends-repository.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { FriendEntity } from '@libs/dao/user/friends/entities/friend.entity';
import { FriendRequestType } from '@libs/common/constants/friend.constants';
import { getDatabaseByUserDbId } from '@libs/dao/config/user/user-database-config.util';
import { RequestResultFriendInDto } from './dto/request-result-friend.dto';
import { Friend } from '@libs/dao/user/friends/interfaces/friend.interface';
import { GetFriendOutDto } from './dto/get-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @Inject(FriendsRepository)
    private readonly friendsDbRepositories: FriendsDbRepositories,

    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async getFriend(userId: number): Promise<GetFriendOutDto[]> {
    const database = ContextProvider.getUserDatabase();

    const friends = await this.friendsDbRepositories[database].findBy({
      userId,
    });

    const friendIds = [];
    const friendHash = Object.fromEntries(
      friends.map((it) => {
        friendIds.push(it.friendUserId);
        return [it.friendUserId, it];
      }),
    );

    const users = await this.usersRepository.findByIdIn(friendIds);

    return users.map((user) => {
      return GetFriendOutDto.of({
        id: friendHash[user.id].id,
        userId: user.id,
        email: user.email,
        name: user.name,
        status: friendHash[user.id].status,
        image: user.image,
      });
    });
  }

  @Transactional(DB_NAME.COMMON)
  async requestFriend(
    user: User,
    requestFriendInDto: RequestFriendInDto,
  ): Promise<GetFriendOutDto> {
    const { recommendCode } = requestFriendInDto;
    const friendUser =
      await this.usersRepository.findAndSetOtherUserDatabaseByRecommendCode(
        recommendCode,
      );

    const [userFriend, friend] = await this._checkFriendRequest(
      user.id,
      friendUser,
      recommendCode,
    );

    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);
    const resultFriend = await this._saveRequestFriend(
      user,
      friendUser,
      userFriend,
      friend,
      friendDatabase,
    );

    return GetFriendOutDto.of({
      id: resultFriend.id,
      userId: friendUser.id,
      email: friendUser.email,
      name: friendUser.name,
      status: resultFriend.status,
      image: friendUser.image,
    });
  }

  @Transactional(DB_NAME.COMMON)
  async requestResultFriend(
    user: User,
    requestResultFriendInDto: RequestResultFriendInDto,
  ): Promise<GetFriendOutDto> {
    const { friendId, status } = requestResultFriendInDto;

    const database = ContextProvider.getUserDatabase();
    const friend =
      await this.friendsDbRepositories[database].findById(friendId);

    if (friend.status != FriendRequestType.Response) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FRIEND_REQUEST_ALREADY_RESULT,
      );
    }

    if (friend.userId != user.id) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FRIEND_REQUEST_INVALID,
      );
    }

    const friendUser = await this.usersRepository.findById(friend.friendUserId);
    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);
    ContextProvider.setOtherUserDatabase(friendDatabase);

    await this._updateFriend(friend, user, friendUser, status);

    return GetFriendOutDto.of({
      id: friend.id,
      userId: friendUser.id,
      email: friendUser.email,
      name: friendUser.name,
      status: friend.status,
      image: friendUser.image,
    });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async deleteFriend(user: User, friendId: number): Promise<void> {
    const database = ContextProvider.getUserDatabase();
    const friend =
      await this.friendsDbRepositories[database].findById(friendId);

    const friendUser = await this.usersRepository.findById(friend.friendUserId);
    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);
    ContextProvider.setOtherUserDatabase(friendDatabase);

    await this._deleteFriend(user, friendUser, friendId);
  }

  @Transactional()
  private async _saveRequestFriend(
    user: User,
    friendUser: User,
    userFriend: Friend,
    friend: Friend,
    friendDatabase: string,
  ): Promise<Friend> {
    const database = ContextProvider.getUserDatabase();
    userFriend = userFriend
      ? userFriend
      : FriendEntity.create({
          userId: user.id,
          friendUserId: friendUser.id,
          status: FriendRequestType.Request,
        });
    userFriend.status = FriendRequestType.Request;

    friend = friend
      ? friend
      : FriendEntity.create({
          userId: friendUser.id,
          friendUserId: user.id,
          status: FriendRequestType.Response,
        });
    friend.status = FriendRequestType.Response;

    await this.friendsDbRepositories[friendDatabase].save(friend, {
      reload: false,
    });

    return await this.friendsDbRepositories[database].save(userFriend);
  }

  private async _checkFriendRequest(
    userId: number,
    friendUser: User,
    recommendCode: string,
  ): Promise<[Friend, Friend]> {
    const myDatabase = ContextProvider.getUserDatabase();

    if (!friendUser) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.RECOMMEND_CODE_NOT_EXIST,
        [recommendCode],
      );
    }

    const request = await this.friendsDbRepositories[myDatabase].findOneBy({
      userId: userId,
      friendUserId: friendUser.id,
    });

    if (request) {
      switch (request.status) {
        case FriendRequestType.Request: {
          throw new ServerErrorException(
            INTERNAL_ERROR_CODE.FRIEND_REQUEST_ALREADY_EXIST,
            [friendUser.name],
          );
        }
        case FriendRequestType.Response: {
          throw new ServerErrorException(
            INTERNAL_ERROR_CODE.FRIEND_RESPONSE_ALREADY_EXIST,
            [friendUser.name],
          );
        }
        case FriendRequestType.Accept: {
          throw new ServerErrorException(
            INTERNAL_ERROR_CODE.FRIEND_ALREADY_EXIST,
            [friendUser.name],
          );
        }
        case FriendRequestType.Block: {
          throw new ServerErrorException(
            INTERNAL_ERROR_CODE.FRIEND_REQUEST_BLOCK,
            [friendUser.name],
          );
        }
      }
    }

    if (!friendUser.userDbId) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.FRIEND_NOT_EXIST, [
        friendUser.name,
      ]);
    }

    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);

    const friend = await this.friendsDbRepositories[friendDatabase].findOneBy({
      userId: userId,
      friendUserId: friendUser.id,
    });

    if (friend && friend.status == FriendRequestType.Block) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.FRIEND_REQUEST_FRIEND_BLOCK,
        [friendUser.name],
      );
    }

    return [request, friend];
  }

  @Transactional()
  private async _updateFriend(
    userFriend: Friend,
    user: User,
    friendUser: User,
    status: FriendRequestType,
  ): Promise<void> {
    const database = ContextProvider.getUserDatabase();
    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);

    const friend = await this.friendsDbRepositories[friendDatabase].findOneBy({
      userId: friendUser.id,
      friendUserId: user.id,
    });

    await this.friendsDbRepositories[database].update(userFriend.id, {
      status,
    });

    await this.friendsDbRepositories[friendDatabase].update(friend.id, {
      status:
        status == FriendRequestType.Block ? FriendRequestType.Reject : status,
    });

    userFriend.status = status;
  }

  @Transactional()
  private async _deleteFriend(
    user: User,
    friendUser: User,
    friendId: number,
  ): Promise<void> {
    const database = ContextProvider.getUserDatabase();
    const friendDatabase = getDatabaseByUserDbId(friendUser.userDbId);

    await this.friendsDbRepositories[database].deleteById(friendId);

    const friend = await this.friendsDbRepositories[friendDatabase].findOneBy({
      userId: friendUser.id,
      friendUserId: user.id,
    });

    if (friend.status != FriendRequestType.Block) {
      await this.friendsDbRepositories[database].deleteById(friendId);
    }
  }
}
