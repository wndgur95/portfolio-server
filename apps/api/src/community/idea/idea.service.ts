import { Inject, Injectable } from '@nestjs/common';
import { Idea } from '@libs/dao/common/ideas/interfaces/idea.interface';
import { IdeasRepository } from '@libs/dao/common/ideas/interfaces/ideas-repository.interface';
import { IdeasRedisRepository } from '@libs/dao/redis/ideas/ideas-redis.repository';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import { CreateIdeaInDto } from './dto/create-idea.dto';
import { ValidateProvider } from '@libs/common/provider/validate.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { IdeaEntity } from '@libs/dao/common/ideas/entities/idea.entity';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { IdeaDoItsDbRepositories } from '@libs/dao/user/idea-do-its/repositories/idea-do-its-db.repository';
import { IdeaDoItsRepository } from '@libs/dao/user/idea-do-its/interfaces/idea-do-its-repository.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { IdeaDoItEntity } from '@libs/dao/user/idea-do-its/entities/idea-do-it.entity';
import { IdeaDoIt } from '@libs/dao/user/idea-do-its/interfaces/idea-do-it.interface';
import { GetIdeaOutDto } from './dto/get-idea.dto';
import { UpdateIdeaInDto } from './dto/update-idea.dto';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { IdeaCommentsRepository } from '@libs/dao/common/idea-comments/interfaces/idea-comments-repository.interface';
import { GetIdeaCommentDto } from './dto/get-idea-comment.dto';
import { CreateIdeaCommentInDto } from './dto/create-idea-comment.dto';
import { IdeaCommentEntity } from '@libs/dao/common/idea-comments/entities/idea-comment.entity';
import { UpdateIdeaCommentInDto } from './dto/update-idea-comment.dto';

@Injectable()
export class IdeaService {
  constructor(
    @Inject(IdeasRepository)
    private readonly ideasRepository: IdeasRepository,
    @Inject(IdeaCommentsRepository)
    private readonly ideaCommentsRepository: IdeaCommentsRepository,

    private readonly ideasRedisRepository: IdeasRedisRepository,
    private readonly validateProvider: ValidateProvider,

    @Inject(IdeaDoItsRepository)
    private readonly ideaDoItsDbRepositories: IdeaDoItsDbRepositories,
  ) {}

  async getIdea(
    pageOptionsDto: PageOptionsDto,
  ): Promise<[GetIdeaOutDto[], PageMetaDto]> {
    const { skip, take } = pageOptionsDto;

    const [ideas, doIts, totalCount] = await this.ideasRedisRepository.get(
      skip,
      take,
    );

    const getIdeaOutDto = ideas.map((it, index) => {
      return GetIdeaOutDto.of({
        ...it,
        doItCount: doIts[index],
      });
    });

    return [
      getIdeaOutDto,
      new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      }),
    ];
  }

  async getMyIdea(user: User): Promise<GetIdeaOutDto[]> {
    const myIdea = await this.ideasRepository.findBy({ userId: user.id });

    if (!myIdea.length) return [];

    const doIts = await this.ideasRedisRepository.getDoItCountByIds(
      myIdea.map((it) => it.id),
    );

    return myIdea.map((idea, index) => {
      return GetIdeaOutDto.of({ ...idea, doItCount: doIts[index] });
    });
  }

  async getIdeaComment(ideaId: number): Promise<GetIdeaCommentDto[]> {
    const ideaComments = await this.ideaCommentsRepository.findBy({ ideaId });

    return ideaComments.map((it) => {
      return GetIdeaCommentDto.of({ ...it });
    });
  }

  @Transactional(DB_NAME.COMMON)
  async createIdea(
    user: User,
    createIdeaInDto: CreateIdeaInDto,
  ): Promise<GetIdeaOutDto> {
    const { nickname, title, contexts } = createIdeaInDto;

    this._checkIdea(nickname, title, contexts);

    const idea = await this._saveIdea(
      IdeaEntity.create({
        userId: user.id,
        ...createIdeaInDto,
      }),
    );

    await this.ideasRedisRepository.set(idea);

    return GetIdeaOutDto.of({
      ...idea,
      doItCount: 0,
    });
  }

  @Transactional(DB_NAME.COMMON)
  async createIdeaComment(
    user: User,
    createIdeaCommentInDto: CreateIdeaCommentInDto,
  ): Promise<GetIdeaCommentDto> {
    const { ideaId, commenter, comment } = createIdeaCommentInDto;

    this._checkIdeaComment(commenter, comment);

    const ideaComment = await this.ideaCommentsRepository.save(
      IdeaCommentEntity.create({
        userId: user.id,
        ideaId,
        commenter,
        comment,
      }),
    );

    return GetIdeaCommentDto.of({ ...ideaComment });
  }

  @Transactional(DB_NAME.COMMON)
  async updateIdea(
    user: User,
    ideaId: number,
    updateIdeaInDto: UpdateIdeaInDto,
  ): Promise<GetIdeaOutDto> {
    const { nickname, title, contexts } = updateIdeaInDto;

    this._checkIdea(nickname, title, contexts);

    const idea = await this.ideasRepository.findById(ideaId);

    if (idea.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.IDEA_NOT_MINE);
    }
    idea.nickname = nickname;
    idea.title = title;
    idea.contexts = contexts;

    await this._saveIdea(idea);
    await this.ideasRedisRepository.set(idea);

    const doItCount = await this.ideasRedisRepository.getDoItCountById(idea.id);

    return GetIdeaOutDto.of({
      ...idea,
      doItCount,
    });
  }

  @Transactional(DB_NAME.COMMON)
  async updateIdeaComment(
    user: User,
    ideaCommentId: number,
    updateIdeaCommentInDto: UpdateIdeaCommentInDto,
  ): Promise<GetIdeaCommentDto> {
    const { commenter, comment } = updateIdeaCommentInDto;

    this._checkIdeaComment(commenter, comment);

    const ideaComment =
      await this.ideaCommentsRepository.findById(ideaCommentId);
    if (ideaComment.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.IDEA_COMMENT_NOT_MINE);
    }

    ideaComment.commenter = commenter;
    ideaComment.comment = comment;

    await this.ideaCommentsRepository.save(ideaComment, { reload: false });

    return GetIdeaCommentDto.of({ ...ideaComment });
  }

  @Transactional(DB_NAME.COMMON)
  async deleteIdea(user: User, ideaId: number): Promise<void> {
    const idea = await this.ideasRepository.findById(ideaId);

    if (idea.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.IDEA_NOT_MINE);
    }

    await this.ideasRepository.delete(ideaId);
    await this.ideaCommentsRepository.delete({ ideaId });
    await this.ideasRedisRepository.delIdea(ideaId);

    for (const database of getUserShardDatabases) {
      ContextProvider.setOtherUserDatabase(database);
    }
    await this._deleteIdeaDoIt(ideaId);
  }

  @Transactional(DB_NAME.COMMON)
  async deleteIdeaComment(user: User, ideaCommentId: number): Promise<void> {
    const ideaComment =
      await this.ideaCommentsRepository.findById(ideaCommentId);
    if (ideaComment.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.IDEA_COMMENT_NOT_MINE);
    }

    await this.ideaCommentsRepository.delete(ideaCommentId);
  }

  @Transactional()
  private async _deleteIdeaDoIt(ideaId: number): Promise<void> {
    for (const database of getUserShardDatabases) {
      await this.ideaDoItsDbRepositories[database].delete({
        ideaId: ideaId,
      });
    }
  }

  async countDoIt(user: User, ideaId: number): Promise<boolean> {
    const database = ContextProvider.getUserDatabase();
    const ideaDoIt =
      (await this.ideaDoItsDbRepositories[database].findOneBy({
        userId: user.id,
        ideaId: ideaId,
      })) ??
      IdeaDoItEntity.create({
        userId: user.id,
        ideaId: ideaId,
        doIt: false,
      });

    ideaDoIt.doIt = !ideaDoIt.doIt;

    await this.ideasRedisRepository.countDoIt(ideaDoIt);

    await this._saveCountDoIt(ideaDoIt);

    return ideaDoIt.doIt;
  }

  private _checkIdea(nickname: string, title: string, contexts: string): void {
    const badNickname = this.validateProvider.checkBadWords(nickname);
    if (badNickname.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.IDEA_INCLUDE_BAD_WORD,
        ['닉네임', badNickname.join(', ')],
      );
    }

    const badTitle = this.validateProvider.checkBadWords(title);
    if (badTitle.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.IDEA_INCLUDE_BAD_WORD,
        ['제목', badTitle.join(', ')],
      );
    }

    const badContexts = this.validateProvider.checkBadWords(contexts);
    if (badContexts.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.IDEA_INCLUDE_BAD_WORD,
        ['내용', badContexts.join(', ')],
      );
    }
  }

  private _checkIdeaComment(commenter: string, comment: string): void {
    const badNickname = this.validateProvider.checkBadWords(commenter);
    if (badNickname.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.IDEA_INCLUDE_BAD_WORD,
        ['닉네임', badNickname.join(', ')],
      );
    }

    const badComment = this.validateProvider.checkBadWords(comment);
    if (badComment.length > 0) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.IDEA_INCLUDE_BAD_WORD,
        ['댓글', badComment.join(', ')],
      );
    }
  }

  @Transactional()
  private async _saveIdea(idea: Idea): Promise<Idea> {
    return await this.ideasRepository.save(idea);
  }

  @Transactional()
  private async _saveCountDoIt(ideaDoIt: IdeaDoIt): Promise<IdeaDoIt> {
    const database = ContextProvider.getUserDatabase();

    return await this.ideaDoItsDbRepositories[database].save(ideaDoIt);
  }
}
