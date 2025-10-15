import { Module, ValidationPipe } from '@nestjs/common';
import { BatchServerConfig } from './config/batch.server.config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { ContractModule } from '@libs/dao/contract/contract.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { BatchController } from './default/batch.controller';
import { BatchService } from './default/batch.service';
import { BatchCommonModule } from '@libs/dao/batch/common/batch-common.module';
import { AirdropService } from './airdrop/airdrop.service';
import { AirdropController } from './airdrop/airdrop.controller';
import { ImportLogController } from './import-log/import-log.controller';
import { ImportLogService } from './import-log/import-log.service';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { ImmutableProvider } from '@libs/common/provider/web3/immutable/immutable.provider';
import { PolygonProvider } from '@libs/common/provider/web3/polygon/polygon.provider';
import { PortfolioProvider } from '@libs/common/provider/web3/portfolio/portfolio.provider';
import { AuthModule } from './auth/auth.module';
import { BatchMessageRepository } from '@libs/dao/redis/batch-message/batch-message.repository';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';
import { MessageKafkaService } from './message-kafka/message-kafka.service';
import { MessageKafkaConsumerService } from './message-kafka/message-kafka-consumer.service';
import { MessageKafkaProducerService } from './message-kafka/message-kafka-producer.service';
import { MessageProvider } from './message/message.provider';
import { Erc1155Controller } from './erc1155/erc1155.controller';
import { Erc1155Service } from './erc1155/erc1155.service';
import { Erc721Service } from './erc721/erc721.service';
import { Erc721Controller } from './erc721/erc721.controller';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { CommonModule } from '@libs/dao/common/common.module';

@Module({
  imports: [
    BatchServerConfig,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    ...[CommonDatabaseConfig, ContractDatabaseConfig, BatchDatabaseConfig].map(
      (it) => {
        return TypeOrmExModule.forRootAsync({
          name: it().name,
          inject: [it.KEY],
          useFactory: async (config: DataSourceOptions) => config,
        });
      },
    ),

    AuthModule,
    ContractModule,
    BatchCommonModule,
    CommonModule,
  ],
  controllers: [
    BatchController,
    ImportLogController,
    AirdropController,
    Erc1155Controller,
    Erc721Controller,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true, // 암시적 타입 변환 활성화 (문자열 → 숫자, 불린 등)
        },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    BatchService,
    ImportLogService,
    AirdropService,
    Erc1155Service,
    Erc721Service,

    Web3Provider,
    ImmutableProvider,
    PolygonProvider,
    PortfolioProvider,

    MessageGateway,
    MessageService,
    MessageProvider,
    MessageKafkaService,
    MessageKafkaConsumerService,
    MessageKafkaProducerService,
    BatchMessageRepository,
  ],
})
export class BatchModule {}
