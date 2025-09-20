import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  RecordMetadata,
} from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected = false;

  constructor() {
    // Kafka 클라이언트 설정 (PLAINTEXT)
    this.kafka = new Kafka({
      clientId: `battle-server-${process.env.SERVER_ID}`,
      brokers: [process.env.KAFKA_BROKER],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    });
    this.consumer = this.kafka.consumer({
      groupId: 'socket-server-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.connect();
      this.logger.log('Kafka service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Kafka service:', error);
      this.logger.warn('Kafka service will continue without connection');
      // Kafka 연결 실패해도 서버는 계속 실행
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  /**
   * Kafka 연결
   */
  private async connect(): Promise<void> {
    try {
      this.logger.log('Attempting to connect to Kafka...');
      await this.producer.connect();
      this.logger.log('Producer connected successfully');
      await this.consumer.connect();
      this.logger.log('Consumer connected successfully');
      this.isConnected = true;
      this.logger.log('Connected to Kafka');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka:', error);
      this.isConnected = false;
      // 연결 실패해도 에러를 던지지 않음
    }
  }

  /**
   * Kafka 연결 해제
   */
  private async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.producer.disconnect();
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Disconnected from Kafka');
      }
    } catch (error) {
      this.logger.error('Failed to disconnect from Kafka:', error);
    }
  }

  /**
   * 메시지 발행
   */
  async publishMessage(
    topic: string,
    message: any,
    key?: string,
  ): Promise<RecordMetadata[]> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected');
    }

    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: key || Date.now().toString(),
            value: JSON.stringify({
              ...message,
              timestamp: Date.now(),
              serverId: process.env.SERVER_ID,
            }),
          },
        ],
      });

      this.logger.log(`Message published to topic ${topic}:`, message);
      return result;
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * 토픽 구독
   */
  async subscribeToTopic(
    topic: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka is not connected');
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          try {
            const message = JSON.parse(
              payload.message.value?.toString() || '{}',
            );
            this.logger.log(`Message received from topic ${topic}:`, message);
            await callback(message);
          } catch (error) {
            this.logger.error(
              `Error processing message from topic ${topic}:`,
              error,
            );
          }
        },
      });

      this.logger.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * 배틀 이벤트 발행
   */
  async publishBattleEvent(
    eventType: string,
    battleId: string,
    data: any,
  ): Promise<RecordMetadata[]> {
    return this.publishMessage(
      'socket-events',
      {
        eventType,
        battleId,
        data,
      },
      battleId,
    );
  }

  /**
   * 플레이어 이벤트 발행
   */
  async publishPlayerEvent(
    eventType: string,
    playerId: string,
    battleId: string,
    data: any,
  ): Promise<RecordMetadata[]> {
    return this.publishMessage(
      'player-events',
      {
        eventType,
        playerId,
        battleId,
        data,
      },
      playerId,
    );
  }

  /**
   * 몬스터 이벤트 발행
   */
  async publishMonsterEvent(
    eventType: string,
    monsterId: string,
    battleId: string,
    data: any,
  ): Promise<RecordMetadata[]> {
    return this.publishMessage(
      'monster-events',
      {
        eventType,
        monsterId,
        battleId,
        data,
      },
      monsterId,
    );
  }

  /**
   * 아이템 이벤트 발행
   */
  async publishItemEvent(
    eventType: string,
    itemId: string,
    battleId: string,
    data: any,
  ): Promise<RecordMetadata[]> {
    return this.publishMessage(
      'item-events',
      {
        eventType,
        itemId,
        battleId,
        data,
      },
      itemId,
    );
  }

  /**
   * 연결 상태 확인
   */
  isKafkaConnected(): boolean {
    return this.isConnected;
  }

  /**
   * 토픽 생성 (관리자용)
   */
  async createTopic(
    topic: string,
    numPartitions = 3,
    replicationFactor = 1,
  ): Promise<void> {
    const admin = this.kafka.admin();
    try {
      await admin.connect();
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions,
            replicationFactor,
          },
        ],
      });
      this.logger.log(`Topic ${topic} created successfully`);
    } catch (error) {
      this.logger.error(`Failed to create topic ${topic}:`, error);
      throw error;
    } finally {
      await admin.disconnect();
    }
  }
}
