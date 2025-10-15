import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DataSourceOptions } from 'typeorm';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { ContractModule } from '@libs/dao/contract/contract.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { BatchServerConfig } from '../../batch/src/config/batch.server.config';
import { BatchController } from '../../batch/src/default/batch.controller';
import { BatchService } from '../../batch/src/default/batch.service';
import { BatchCommonModule } from '@libs/dao/batch/common/batch-common.module';
import { ImportLogController } from '../../batch/src/import-log/import-log.controller';
import { ImportLogService } from '../../batch/src/import-log/import-log.service';
import { AirdropController } from '../../batch/src/airdrop/airdrop.controller';
import { AirdropService } from '../../batch/src/airdrop/airdrop.service';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { ImmutableProvider } from '@libs/common/provider/web3/immutable/immutable.provider';
import { PolygonProvider } from '@libs/common/provider/web3/polygon/polygon.provider';
import { PortfolioProvider } from '@libs/common/provider/web3/portfolio/portfolio.provider';
import { AuthModule } from '../../batch/src/auth/auth.module';
import { MessageGateway } from '../../batch/src/message/message.gateway';
import { MessageService } from '../../batch/src/message/message.service';
import { MessageProvider } from '../../batch/src/message/message.provider';
import { MessageKafkaService } from '../../batch/src/message-kafka/message-kafka.service';
import { MessageKafkaConsumerService } from '../../batch/src/message-kafka/message-kafka-consumer.service';
import { MessageKafkaProducerService } from '../../batch/src/message-kafka/message-kafka-producer.service';
import { BatchMessageRepository } from '@libs/dao/redis/batch-message/batch-message.repository';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from '@libs/common/constants/jwt.constants';
import { Erc1155Service } from '../../batch/src/erc1155/erc1155.service';
import { Erc1155Controller } from '../../batch/src/erc1155/erc1155.controller';
import { Erc721Controller } from '../../batch/src/erc721/erc721.controller';
import { Erc721Service } from '../../batch/src/erc721/erc721.service';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { CommonModule } from '@libs/dao/common/common.module';

@Module({
  imports: [
    BatchServerConfig,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: JWT_OPTIONS.expiresIn },
    }),
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
export class BatchElementModule {}
