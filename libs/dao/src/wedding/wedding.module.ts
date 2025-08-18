import { Module } from '@nestjs/common';
import { WeddingMessagesModule } from '@libs/dao/wedding/wedding-messages/wedding-messages.module';
import { RoulettesModule } from '@libs/dao/wedding/roulettes/roulettes.module';

@Module({
  exports: [WeddingMessagesModule, RoulettesModule],
  imports: [WeddingMessagesModule, RoulettesModule],
})
export class WeddingModule {}
