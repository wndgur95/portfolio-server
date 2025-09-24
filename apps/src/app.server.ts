import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';
import { ApiElementModule } from './modules/api-element.module';
import { GameElementModule } from './modules/game-element.module';
import { SocketElementModule } from './modules/socker-element.module';
import { LogElementModule } from './modules/log-element.module';

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

    this._initializeApiSwagger();
    this._initializeGameSwagger();
    this._initializeSocketSwagger();
    this._initializeLogSwagger();
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
      include: [ApiElementModule],
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
      include: [GameElementModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup(
      'game/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeSocketSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Socket Server')
      .setDescription('API description')
      .setVersion('1.0')
      .addBasicAuth(
        {
          type: 'http',
          name: 'Authorization',
          in: 'header',
          description: 'Username: email & Password: password',
        },
        'basic',
      )
      .build();

    const document = SwaggerModule.createDocument(this.app, config, {
      include: [SocketElementModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup(
      'socket/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeLogSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Log Server')
      .setDescription('API description')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'nfToken',
          in: 'header',
          description: 'internal api',
        },
        'nfToken',
      )
      .build();

    const document = SwaggerModule.createDocument(this.app, config, {
      include: [LogElementModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup(
      'log/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }
}
