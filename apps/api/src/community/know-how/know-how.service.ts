import { Inject, Injectable } from '@nestjs/common';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { GetKnowHowCommentDto } from './dto/get-know-how-comment.dto';
import { KnowHowsRepository } from '@libs/dao/common/know-hows/interfaces/know-hows-repository.interface';
import { KnowHowCommentsRepository } from '@libs/dao/common/know-how-comments/interfaces/know-how-comments-repository.interface';
import { KnowHowsRedisRepository } from '@libs/dao/redis/know-hows/know-hows-redis.repository';
import { GetKnowHowDto } from './dto/get-know-how.dto';
import { CreateKnowHowInDto } from './dto/create-know-how.dto';
import { KnowHowEntity } from '@libs/dao/common/know-hows/entities/know-how.entity';
import { CreateKnowHowCommentInDto } from './dto/create-know-how-comment.dto';
import { KnowHowCommentEntity } from '@libs/dao/common/know-how-comments/entities/know-how-comment.entity';
import { UpdateKnowHowInDto } from './dto/update-know-how.dto';
import { KnowHow } from '@libs/dao/common/know-hows/interfaces/know-how.interface';
import { UpdateKnowHowCommentInDto } from './dto/update-know-how-comment.dto';
import { KnowHowRecommendsRepository } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommends-repository.interface';
import { KnowHowRecommendsDbRepositories } from '@libs/dao/user/know-how-recommends/repositories/know-how-recommends-db.repository';
import { KnowHowRecommendEntity } from '@libs/dao/user/know-how-recommends/entities/know-how-recommend.entity';
import { KnowHowRecommend } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommend.interface';

@Injectable()
export class KnowHowService {
  constructor(
    @Inject(KnowHowsRepository)
    private readonly knowHowsRepository: KnowHowsRepository,
    @Inject(KnowHowCommentsRepository)
    private readonly knowHowCommentsRepository: KnowHowCommentsRepository,

    private readonly knowHowsRedisRepository: KnowHowsRedisRepository,
    private readonly validateProvider: ValidateProvider,

    @Inject(KnowHowRecommendsRepository)
    private readonly knowHowRecommendsDbRepositories: KnowHowRecommendsDbRepositories,
  ) {}

  async getKnowHow(
    pageOptionsDto: PageOptionsDto,
  ): Promise<[GetKnowHowDto[], PageMetaDto]> {
    const { skip, take } = pageOptionsDto;

    const [knowHows, recommends, totalCount] =
      await this.knowHowsRedisRepository.get(skip, take);

    const getKnowHowDto = knowHows.map((it, index) => {
      return GetKnowHowDto.of({
        ...it,
        recommendCount: recommends[index],
      });
    });

    return [
      getKnowHowDto,
      new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      }),
    ];
  }

  async getMyKnowHow(user: User): Promise<GetKnowHowDto[]> {
    const myKnowHows = await this.knowHowsRepository.findBy({
      userId: user.id,
    });

    if (!myKnowHows.length) return [];

    const recommends =
      await this.knowHowsRedisRepository.getRecommendCountByIds(
        myKnowHows.map((it) => it.id),
      );

    return myKnowHows.map((knowHow, index) => {
      return GetKnowHowDto.of({
        ...knowHow,
        recommendCount: recommends[index],
      });
    });
  }

  async getKnowHowComment(knowHowId: number): Promise<GetKnowHowCommentDto[]> {
    const knowHowComments = await this.knowHowCommentsRepository.findBy({
      knowHowId,
    });

    return knowHowComments.map((it) => {
      return GetKnowHowCommentDto.of({ ...it });
    });
  }

  @Transactional(DB_NAME.COMMON)
  async createKnowHow(
    user: User,
    createKnowHowInDto: CreateKnowHowInDto,
  ): Promise<GetKnowHowDto> {
    const { nickname, title, contexts } = createKnowHowInDto;

    this._checkKnowHow(nickname, title, contexts);

    const knowHow = await this._saveKnowHow(
      KnowHowEntity.create({
        userId: user.id,
        ...createKnowHowInDto,
      }),
    );

    await this.knowHowsRedisRepository.set(knowHow);

    return GetKnowHowDto.of({
      ...knowHow,
      recommendCount: 0,
    });
  }

  @Transactional(DB_NAME.COMMON)
  async createKnowHowComment(
    user: User,
    createKnowHowCommentInDto: CreateKnowHowCommentInDto,
  ): Promise<GetKnowHowCommentDto> {
    const { knowHowId, commenter, comment } = createKnowHowCommentInDto;

    this._checkKnowHowComment(commenter, comment);

    const knowHowComment = await this.knowHowCommentsRepository.save(
      KnowHowCommentEntity.create({
        userId: user.id,
        knowHowId,
        commenter,
        comment,
      }),
    );

    return GetKnowHowCommentDto.of({ ...knowHowComment });
  }

  @Transactional(DB_NAME.COMMON)
  async updateKnowHow(
    user: User,
    knowHowId: number,
    updateKnowHowInDto: UpdateKnowHowInDto,
  ): Promise<GetKnowHowDto> {
    const { nickname, title, contexts } = updateKnowHowInDto;

    this._checkKnowHow(nickname, title, contexts);

    const knowHow = await this.knowHowsRepository.findById(knowHowId);

    if (knowHow.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.KNOW_HOW_NOT_MINE);
    }
    knowHow.nickname = nickname;
    knowHow.title = title;
    knowHow.contexts = contexts;

    await this._saveKnowHow(knowHow);
    await this.knowHowsRedisRepository.set(knowHow);

    const recommendCount =
      await this.knowHowsRedisRepository.getRecommendCountById(knowHow.id);

    return GetKnowHowDto.of({
      ...knowHow,
      recommendCount,
    });
  }

  @Transactional(DB_NAME.COMMON)
  async updateKnowHowComment(
    user: User,
    knowHowCommentId: number,
    updateKnowHowCommentInDto: UpdateKnowHowCommentInDto,
  ): Promise<GetKnowHowCommentDto> {
    const { commenter, comment } = updateKnowHowCommentInDto;

    this._checkKnowHowComment(commenter, comment);

    const knowHowComment =
      await this.knowHowCommentsRepository.findById(knowHowCommentId);
    if (knowHowComment.userId != user.id) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_COMMENT_NOT_MINE,
      );
    }

    knowHowComment.commenter = commenter;
    knowHowComment.comment = comment;

    await this.knowHowCommentsRepository.save(knowHowComment, {
      reload: false,
    });

    return GetKnowHowCommentDto.of({ ...knowHowComment });
  }

  @Transactional(DB_NAME.COMMON)
  async deleteKnowHow(user: User, knowHowId: number): Promise<void> {
    const knowHow = await this.knowHowsRepository.findById(knowHowId);

    if (knowHow.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.KNOW_HOW_NOT_MINE);
    }

    await this.knowHowsRepository.delete(knowHowId);
    await this.knowHowCommentsRepository.delete({ knowHowId });
    await this.knowHowsRedisRepository.delKnowHow(knowHowId);

    for (const database of getUserShardDatabases) {
      ContextProvider.setOtherUserDatabase(database);
    }
    await this._deleteKnowHowRecommend(knowHowId);
  }

  @Transactional(DB_NAME.COMMON)
  async deleteKnowHowComment(
    user: User,
    knowHowCommentId: number,
  ): Promise<void> {
    const knowHowComment =
      await this.knowHowCommentsRepository.findById(knowHowCommentId);
    if (knowHowComment.userId != user.id) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_COMMENT_NOT_MINE,
      );
    }

    await this.knowHowCommentsRepository.delete(knowHowCommentId);
  }

  @Transactional()
  private async _deleteKnowHowRecommend(knowHowId: number): Promise<void> {
    for (const database of getUserShardDatabases) {
      await this.knowHowRecommendsDbRepositories[database].delete({
        knowHowId: knowHowId,
      });
    }
  }

  async countRecommend(user: User, knowHowId: number): Promise<boolean> {
    const database = ContextProvider.getUserDatabase();
    const knowHowRecommend =
      (await this.knowHowRecommendsDbRepositories[database].findOneBy({
        userId: user.id,
        knowHowId: knowHowId,
      })) ??
      KnowHowRecommendEntity.create({
        userId: user.id,
        knowHowId: knowHowId,
        recommend: false,
      });

    knowHowRecommend.recommend = !knowHowRecommend.recommend;

    await this.knowHowsRedisRepository.countRecommend(knowHowRecommend);

    await this._saveCountRecommend(knowHowRecommend);

    return knowHowRecommend.recommend;
  }

  private _checkKnowHow(
    nickname: string,
    title: string,
    contexts: string,
  ): void {
    const badNickname = this.validateProvider.checkBadWords(nickname);
    if (badNickname.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_INCLUDE_BAD_WORD,
        ['닉네임', badNickname.join(', ')],
      );
    }

    const badTitle = this.validateProvider.checkBadWords(title);
    if (badTitle.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_INCLUDE_BAD_WORD,
        ['제목', badTitle.join(', ')],
      );
    }

    const badContexts = this.validateProvider.checkBadWords(contexts);
    if (badContexts.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_INCLUDE_BAD_WORD,
        ['내용', badContexts.join(', ')],
      );
    }
  }

  private _checkKnowHowComment(commenter: string, comment: string): void {
    const badNickname = this.validateProvider.checkBadWords(commenter);
    if (badNickname.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_INCLUDE_BAD_WORD,
        ['닉네임', badNickname.join(', ')],
      );
    }

    const badComment = this.validateProvider.checkBadWords(comment);
    if (badComment.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.KNOW_HOW_INCLUDE_BAD_WORD,
        ['댓글', badComment.join(', ')],
      );
    }
  }

  @Transactional()
  private async _saveKnowHow(knowHow: KnowHow): Promise<KnowHow> {
    return await this.knowHowsRepository.save(knowHow);
  }

  @Transactional()
  private async _saveCountRecommend(
    knowHowRecommend: KnowHowRecommend,
  ): Promise<KnowHowRecommend> {
    const database = ContextProvider.getUserDatabase();

    return await this.knowHowRecommendsDbRepositories[database].save(
      knowHowRecommend,
    );
  }
}
