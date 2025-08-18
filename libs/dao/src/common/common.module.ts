import { Module } from '@nestjs/common';
import { UsersModule } from '@libs/dao/common/users/users.module';
import { GroupsModule } from '@libs/dao/common/groups/groups.module';
import { GroupMembersModule } from '@libs/dao/common/group-members/group-members.module';
import { GroupInvitesModule } from '@libs/dao/common/group-invites/group-invites.module';
import { FrequentlyQuestionsModule } from '@libs/dao/common/frequently-questions/frequently-questions.module';
import { PatchNotesModule } from '@libs/dao/common/patch-notes/patch-notes.module';
import { DeveloperNotesModule } from '@libs/dao/common/developer-notes/developer-notes.module';
import { IdeasModule } from '@libs/dao/common/ideas/ideas.module';
import { IdeaCommentsModule } from '@libs/dao/common/idea-comments/idea-comments.module';
import { KnowHowCommentsModule } from '@libs/dao/common/know-how-comments/know-how-comments.module';
import { KnowHowsModule } from '@libs/dao/common/know-hows/know-hows.module';

@Module({
  imports: [
    UsersModule,
    GroupsModule,
    GroupMembersModule,
    GroupInvitesModule,
    FrequentlyQuestionsModule,
    PatchNotesModule,
    DeveloperNotesModule,
    IdeasModule,
    IdeaCommentsModule,
    KnowHowCommentsModule,
    KnowHowsModule,
  ],
  exports: [
    UsersModule,
    GroupsModule,
    GroupMembersModule,
    GroupInvitesModule,
    FrequentlyQuestionsModule,
    PatchNotesModule,
    DeveloperNotesModule,
    IdeasModule,
    IdeaCommentsModule,
    KnowHowCommentsModule,
    KnowHowsModule,
  ],
})
export class CommonModule {}
