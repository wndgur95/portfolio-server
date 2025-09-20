import { INestApplication, Logger } from '@nestjs/common';

export class SocketServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * initialize server
   */
  init(): void {
    // WebSocket 서버는 Swagger가 필요없음
    Logger.log('WebSocket Server initialized');
  }

  /**
   * execute server
   */
  async run(): Promise<void> {
    Logger.log('WebSocket Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }
}