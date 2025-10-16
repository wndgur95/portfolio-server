import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';

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
    if (NODE_ENV != ENVIRONMENT.PRODUCTION) {
      const config = new DocumentBuilder()
        .setTitle('Game Server')
        .setDescription('API description')
        .setVersion('1.0')
        .addApiKey(
          {
            type: 'apiKey',
            name: 'X-API-KEY',
            in: 'header',
            description: 'api',
          },
          'apiKey',
        )
        .addBasicAuth(
          {
            type: 'http',
            name: 'Authorization',
            in: 'header',
            description: 'Username: email & Password: password',
          },
          'basic',
        )
        .addBearerAuth(
          {
            type: 'http',
            name: 'Authorization',
            in: 'header',
            description: 'refresh token',
          },
          'jwt-refresh',
        )
        .addBearerAuth(
          {
            type: 'http',
            name: 'Authorization',
            in: 'header',
            description: 'jwt auth',
          },
          'jwt',
        )
        .addBearerAuth({ type: 'http' }, 'kakao-token')
        .build();

      const document = SwaggerModule.createDocument(this.app, config);

      SwaggerModule.setup(
        'game/api-docs',
        this.app,
        document,
        SWAGGER_CUSTOM_OPTIONS,
      );
    }
  }
}
