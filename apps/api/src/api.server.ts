import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';

export class ApiServer {
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
    this.app.setGlobalPrefix('api');
    this._initializeSwagger();
  }

  /**
   * execute server
   */
  async run(): Promise<void> {
    Logger.log('Api Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Api Server')
      .setDescription('API description')
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
      'api/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }
}
