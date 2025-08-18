import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GetBugReportOutDto } from './dto/get-bug-report.dto';
import { BugReportsRepository } from '@libs/dao/user/bug-reports/interfaces/bug-reports-repository.interface';
import { BugReportsDbRepositories } from '@libs/dao/user/bug-reports/repositories/bug-reports-db.repository';
import { BugReportCommentsDbRepositories } from '@libs/dao/user/bug-report-comments/repositories/bug-report-comments-db.repository';
import { BugReportCommentsRepository } from '@libs/dao/user/bug-report-comments/interfaces/bug-report-comments-repository.interface';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import {
  CreateBugReportInDto,
  CreateBugReportOutDto,
} from './dto/create-bug-report.dto';
import { BugReport } from '@libs/dao/user/bug-reports/interfaces/bug-report.interface';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { BugReportEntity } from '@libs/dao/user/bug-reports/entities/bug-report.entity';
import {
  UpdateBugReportInDto,
  UpdateBugReportOutDto,
} from './dto/update-bug-report.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { GetBugReportCommentDto } from './dto/get-bug-report-comment.dto';
import {
  CreateBugReportCommentInDto,
  CreateBugReportCommentOutDto,
} from './dto/create-bug-report-comment.dto';
import { USER_ROLES } from '@libs/common/constants/role.constants';
import { BugReportComment } from '@libs/dao/user/bug-report-comments/interfaces/bug-report-comment.interface';
import { BugReportCommentEntity } from '@libs/dao/user/bug-report-comments/entities/bug-report-comment.entity';
import { BugCommenter } from '@libs/common/constants/community.constants';
import {
  UpdateBugReportCommentInDto,
  UpdateBugReportCommentOutDto,
} from './dto/update-bug-report-comment.dto';

@Injectable()
export class BugReportService {
  constructor(
    @Inject(BugReportsRepository)
    private readonly bugReportsDbRepositories: BugReportsDbRepositories,

    @Inject(BugReportCommentsRepository)
    private readonly bugReportCommentsDbRepositories: BugReportCommentsDbRepositories,
  ) {}

  async getBugReport(userId: number): Promise<GetBugReportOutDto[]> {
    const database = ContextProvider.getUserDatabase();

    const bugReports = await this.bugReportsDbRepositories[database].findBy({
      userId,
    });

    return bugReports.map((bugReport) => {
      return GetBugReportOutDto.of({ ...bugReport });
    });
  }

  async getBugReportComment(
    user: User,
    bugReportId: number,
  ): Promise<GetBugReportCommentDto[]> {
    const database = ContextProvider.getUserDatabase();

    const bugReport =
      await this.bugReportsDbRepositories[database].findById(bugReportId);

    await this._checkBugReportComment(bugReport, user);

    const comments = await this.bugReportCommentsDbRepositories[
      database
    ].findBy({ bugReportId });

    return comments.map((it) => {
      return GetBugReportCommentDto.of({ ...it });
    });
  }

  async createBugReport(
    user: User,
    createBugReportInDto: CreateBugReportInDto,
  ): Promise<CreateBugReportOutDto> {
    const bugReport = await this._saveBugReport(
      BugReportEntity.create({
        userId: user.id,
        type: createBugReportInDto.type,
        title: createBugReportInDto.title,
        contexts: createBugReportInDto.contexts,
      }),
    );

    return CreateBugReportOutDto.of({ ...bugReport });
  }

  async createBugReportComment(
    user: User,
    createBugReportCommentInDto: CreateBugReportCommentInDto,
  ): Promise<CreateBugReportCommentOutDto> {
    const { bugReportId, comment } = createBugReportCommentInDto;

    const database = ContextProvider.getUserDatabase();

    const bugReport =
      await this.bugReportsDbRepositories[database].findById(bugReportId);

    await this._checkBugReportComment(bugReport, user);

    const bugReportComment = await this._saveBugReportComment(
      BugReportCommentEntity.create({
        bugReportId,
        commenter:
          user.id == bugReport.userId
            ? BugCommenter.Questioner
            : BugCommenter.Answer,
        comment,
      }),
    );

    return CreateBugReportCommentOutDto.of({ ...bugReportComment });
  }

  async updateBugReport(
    user: User,
    bugReportId: number,
    updateBugReportInDto: UpdateBugReportInDto,
  ): Promise<UpdateBugReportOutDto> {
    const database = ContextProvider.getUserDatabase();
    const bugReport =
      await this.bugReportsDbRepositories[database].findById(bugReportId);

    if (bugReport.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BUG_REPORT_NOT_MINE);
    }

    bugReport.type = updateBugReportInDto.type;
    bugReport.title = updateBugReportInDto.title;
    bugReport.contexts = updateBugReportInDto.contexts;

    return UpdateBugReportOutDto.of({
      ...(await this._saveBugReport(bugReport)),
    });
  }

  async updateBugReportComment(
    user: User,
    bugReportCommentId: number,
    updateBugReportCommentInDto: UpdateBugReportCommentInDto,
  ): Promise<UpdateBugReportCommentOutDto> {
    const { bugReportId, comment } = updateBugReportCommentInDto;

    const database = ContextProvider.getUserDatabase();
    const bugReport =
      await this.bugReportsDbRepositories[database].findById(bugReportId);

    await this._checkBugReportComment(bugReport, user);

    const bugReportComment =
      await this.bugReportCommentsDbRepositories[database].findById(
        bugReportCommentId,
      );

    bugReportComment.comment = comment;

    return UpdateBugReportCommentOutDto.of({
      ...(await this._saveBugReportComment(bugReportComment)),
    });
  }

  async deleteBugReport(user: User, bugReportId: number): Promise<void> {
    const database = ContextProvider.getUserDatabase();
    const bugReport =
      await this.bugReportsDbRepositories[database].findById(bugReportId);

    if (bugReport.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BUG_REPORT_NOT_MINE);
    }

    await this._deleteBugReport(bugReportId);
  }

  async deleteBugReportComment(
    user: User,
    bugReportCommentId: number,
  ): Promise<void> {
    const database = ContextProvider.getUserDatabase();
    const bugReportComment =
      await this.bugReportCommentsDbRepositories[database].findById(
        bugReportCommentId,
      );

    const bugReport = await this.bugReportsDbRepositories[database].findById(
      bugReportComment.bugReportId,
    );

    if (bugReport.userId != user.id) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BUG_REPORT_NOT_MINE);
    }

    await this._deleteBugReportComment(bugReportCommentId);
  }

  @Transactional()
  private async _saveBugReport(bugReport: BugReport): Promise<BugReport> {
    const database = ContextProvider.getUserDatabase();

    return await this.bugReportsDbRepositories[database].save(bugReport);
  }

  @Transactional()
  private async _saveBugReportComment(
    bugReportComment: BugReportComment,
  ): Promise<BugReportComment> {
    const database = ContextProvider.getUserDatabase();

    return await this.bugReportCommentsDbRepositories[database].save(
      bugReportComment,
    );
  }

  @Transactional()
  private async _deleteBugReport(bugReportId: number): Promise<void> {
    const database = ContextProvider.getUserDatabase();

    await this.bugReportsDbRepositories[database].deleteById(bugReportId);
  }

  @Transactional()
  private async _deleteBugReportComment(
    bugReportCommentId: number,
  ): Promise<void> {
    const database = ContextProvider.getUserDatabase();

    await this.bugReportCommentsDbRepositories[database].deleteById(
      bugReportCommentId,
    );
  }

  private async _checkBugReportComment(
    bugReport: BugReport,
    user: User,
  ): Promise<void> {
    if (bugReport.userId != user.id && user.roles != USER_ROLES.ADMIN) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.BUG_REPORT_NOT_MINE);
    }
  }
}
