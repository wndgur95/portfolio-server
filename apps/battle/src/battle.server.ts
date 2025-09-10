import { INestApplication, Logger } from '@nestjs/common';

export class BattleServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * initialize server
   */
  init(): void {
    // WebSocket 서버는 Swagger가 필요없음
    Logger.log('Battle WebSocket Server initialized');
  }

  /**
   * execute server
   */
  async run(): Promise<void> {
    Logger.log('Battle WebSocket Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }
}