import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.game.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [],
    }),
  ],
})
export class GameServerConfig {}
