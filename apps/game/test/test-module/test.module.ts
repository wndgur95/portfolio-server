import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/promise.extension';
import '@extension/date.extension';
import { Test } from '@nestjs/testing';
import { GameModule } from '../../src/game.module';
import { ConfigModule } from '@nestjs/config';

export const getTestModule = Test.createTestingModule({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.game.test.env',
    }),
    GameModule,
  ],
}).compile();