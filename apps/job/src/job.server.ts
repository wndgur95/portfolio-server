import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';

export class JobServer {
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
    Logger.log('Job Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Job Server')
      .setDescription('The Job API description')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-KEY',
          in: 'header',
          description: 'luxon job',
        },
        'apiKey',
      )
      .build();

    const document = SwaggerModule.createDocument(this.app, config);

    SwaggerModule.setup(
      'job/api-docs',
      this.app,
      document,
      SWAGGER_CUSTOM_OPTIONS,
    );
  }
}
