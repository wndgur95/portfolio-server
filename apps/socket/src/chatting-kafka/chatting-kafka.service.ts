import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class ChattingKafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ChattingKafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  async onModuleInit(): Promise<void> {
    try {
      // 디버깅: 환경변수 값 확인
      this.logger.log(`KAFKA_BROKER 환경변수: ${process.env.KAFKA_BROKER}`);
      this.logger.log(`SERVER_ID 환경변수: ${process.env.SERVER_ID}`);
      
      this.kafka = new Kafka({
        clientId: `chat-service-${process.env.SERVER_ID}`,
        brokers: [process.env.KAFKA_BROKER || 'kafka.kafka.svc.cluster.local:9092'],
        retry: {
          initialRetryTime: 100,
          retries: 8
        }
      });

      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({ 
        groupId: `chat-service-group-${process.env.SERVER_ID}`
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
    try {
      await this.producer?.disconnect();
      await this.consumer?.disconnect();
      this.logger.log('Kafka 연결 해제 완료');
    } catch (error) {
      this.logger.error('Kafka 연결 해제 실패:', error);
    }
  }

  getProducer(): Producer {
    if (!this.producer) {
      throw new Error('Kafka producer가 초기화되지 않았습니다.');
    }
    return this.producer;
  }

  getConsumer(): Consumer {
    if (!this.consumer) {
      throw new Error('Kafka consumer가 초기화되지 않았습니다.');
    }
    return this.consumer;
  }

  getKafka(): Kafka {
    if (!this.kafka) {
      throw new Error('Kafka가 초기화되지 않았습니다.');
    }
    return this.kafka;
  }
}
