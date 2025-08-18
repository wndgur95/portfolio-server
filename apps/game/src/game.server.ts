import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';

export class GameServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * initialize server
   */
  init(): void {
    this._initializeSwagger();
  }

  /**
   * execute server
   */
  async run(): Promise<void> {
    Logger.log('Game Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeSwagger(): void {
    if (!['prod'].includes(process.env.NODE_ENV)) {
      const config = new DocumentBuilder()
        .setTitle('Dino Game Server')
        .setDescription('The Game API description')
        .setVersion('1.0')
        .addApiKey(
          {
            type: 'apiKey',
            name: 'X-API-KEY',
            in: 'header',
            description: 'eh internal api',
          },
          'apiKey',
        )
        .addBasicAuth(
          {
            type: 'http',
            name: 'Authorization',
            in: 'header',
            description: 'Username: accountKey & Password: sessionKey',
          },
          'basic',
        )
        .build();

      const document = SwaggerModule.createDocument(this.app, config);

      SwaggerModule.setup(
        'api-docs',
        this.app,
        document,
        SWAGGER_CUSTOM_OPTIONS,
      );
    }
  }
}
