import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';
import { ApiModule } from '../api/src/api.module';
import { GameModule } from '../game/src/game.module';

export class AppServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * initialize server
   */
  init(): void {
    this.app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    // this.app.setGlobalPrefix('api');
    this._initializeApiSwagger();
    this._initializeGameSwagger();
  }

  /**
   * execute server
   */
  async run(): Promise<void> {
    Logger.log('App Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeApiSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Api Server')
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

    const document = SwaggerModule.createDocument(this.app, config, {
      include: [ApiModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup(
      'api/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeGameSwagger(): void {
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

    const document = SwaggerModule.createDocument(this.app, config, {
      include: [GameModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup(
      'game/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }
}
