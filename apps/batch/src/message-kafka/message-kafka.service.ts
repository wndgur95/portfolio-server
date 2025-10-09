import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { EnvProvider } from '@libs/common/provider/env.provider';

@Injectable()
export class MessageKafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessageKafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  async onModuleInit(): Promise<void> {
    if (!EnvProvider.isProd()) return;
    try {
      // 디버깅: 환경변수 값 확인
      this.logger.log(`KAFKA_BROKER 환경변수: ${process.env.KAFKA_BROKER}`);
      this.logger.log(`SERVER_ID 환경변수: ${process.env.SERVER_ID}`);

      this.kafka = new Kafka({
        clientId: `${process.env.NODE_ENV}-portfolio-batch-message-service`,
        brokers: [
          process.env.KAFKA_BROKER || 'kafka.kafka.svc.cluster.local:9092',
        ],
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      });

      const splitServerId = process.env.SERVER_ID.split('-');
      const shortServerId = splitServerId[splitServerId.length - 1];

      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({
        groupId: `batch-message-service-group-${shortServerId}`,
      });

      await this.producer.connect();
      await this.consumer.connect();

      this.logger.log('Kafka 연결 성공');
    } catch (error) {
      this.logger.error('Kafka 연결 실패:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!EnvProvider.isProd()) return;
    try {
      await this.producer?.disconnect();
      await this.consumer?.disconnect();
      this.logger.log('Kafka 연결 해제 완료');
    } catch (error) {
      this.logger.error('Kafka 연결 해제 실패:', error);
    }
  }

  getProducer(): Producer {
    if (!EnvProvider.isProd()) return;
    if (!this.producer) {
      throw new Error('Kafka producer가 초기화되지 않았습니다.');
    }
    return this.producer;
  }

  getConsumer(): Consumer {
    if (!EnvProvider.isProd()) return;
    if (!this.consumer) {
      throw new Error('Kafka consumer가 초기화되지 않았습니다.');
    }
    return this.consumer;
  }

  getKafka(): Kafka {
    if (!EnvProvider.isProd()) return;
    if (!this.kafka) {
      throw new Error('Kafka가 초기화되지 않았습니다.');
    }
    return this.kafka;
  }
}
