import { Module } from '@nestjs/common';
import { FriendsModule } from '@libs/dao/user/friends/friends.module';
import { UserDetailsModule } from '@libs/dao/user/user-details/user-details.module';
import { BugReportCommentsModule } from '@libs/dao/user/bug-report-comments/bug-report-comments.module';
import { BugReportsModule } from '@libs/dao/user/bug-reports/bug-reports.module';
import { QuestionsModule } from '@libs/dao/user/questions/questions.module';
import { IdeaDoItsModule } from '@libs/dao/user/idea-do-its/idea-do-its.module';
import { KnowHowRecommendsModule } from '@libs/dao/user/know-how-recommends/know-how-recommends.module';

@Module({
  exports: [
    FriendsModule,
    UserDetailsModule,
    BugReportCommentsModule,
    BugReportsModule,
    QuestionsModule,
    IdeaDoItsModule,
    KnowHowRecommendsModule,
  ],
  imports: [
    FriendsModule,
    UserDetailsModule,
    BugReportCommentsModule,
    BugReportsModule,
    QuestionsModule,
    IdeaDoItsModule,
    KnowHowRecommendsModule,
  ],
})
export class UserModule {}
