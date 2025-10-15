import { Inject, Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { TopicProvider } from '@libs/dao/batch/common/topic/topic.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ShapeOwnerLogProvider } from '@libs/dao/batch/common/shape-owner-log/shape-owner-log.provider';
import {
  CONTRACT,
  DEFAULT_ADDRESS,
  LOG_STATUS,
} from '@libs/common/constants/contract.contstants';
import {
  HEX_STANDARD,
  LOG_USER_ADDRESS_STANDARD,
} from '@libs/common/utils/web3.utils';
import { ShapeMintLogProvider } from '@libs/dao/batch/common/shape-mint-log/shape-mint-log.provider';
import { ShapeEventLogProvider } from '@libs/dao/batch/common/shape-event-log/shape-event-log.provider';
import { Web3ContractDto } from '@libs/common/provider/web3/dto/web3-contract.dto';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { keccak256 } from 'ethers/lib/utils';
import { randomUUID } from 'node:crypto';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ShapesDbRepository } from '@libs/dao/contract/shapes/repositories/shapes-db.repository';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';
import { ShapeEntity } from '@libs/dao/contract/shapes/entities/shape.entity';
import {
  ENVIRONMENT,
  NODE_ENV,
} from '@libs/common/constants/environment.constants';
import { BATCH_MESSAGE_TYPE } from '../message-kafka/interfaces/message-kafka-event.interface';
import { MessageProvider } from '../message/message.provider';
import { UsersDbRepository } from '@libs/dao/common/users/repositories/users-db.repository';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';

@Injectable()
export class Erc721Service {
  constructor(
    private readonly messageProvider: MessageProvider,
    @Inject(ShapesRepository)
    private readonly shapesRepository: ShapesDbRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersDbRepository,

    private readonly shapeOwnerLogProvider: ShapeOwnerLogProvider,
    private readonly shapeMintLogProvider: ShapeMintLogProvider,
    private readonly shapeEventLogProvider: ShapeEventLogProvider,
    private readonly topicProvider: TopicProvider,
    private readonly web3: Web3Provider,
  ) {}

  private TOPIC_TRANSFER_OWNER = ['TransferOwner'];
  private TOPIC_SHAPE_GACHA = ['GachaShape'];
  private TOPIC_SHAPE_MINT = ['MintShape'];

  @TransactionalEx(DB_NAME.BATCH, DB_NAME.CONTRACT)
  async transferOwner(): Promise<void> {
    const topics = await this.topicProvider.repository.findTopicByNames(
      this.TOPIC_TRANSFER_OWNER,
    );
    if (!topics.length) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.TOPIC_NOT_FOUND,
        this.TOPIC_TRANSFER_OWNER,
      );
    }
    const currentLogs =
      await this.shapeOwnerLogProvider.repository.findByTopicIds(
        topics.map((it) => {
          return it.id;
        }),
      );
    if (!currentLogs.length) return;

    const transferOrder = {};
    const completeIds = [];
    const tokenIds = [];

    for (const log of currentLogs) {
      if (log.address != DEFAULT_ADDRESS.NULL_ADDRESS) {
        const tokenId = parseInt(log.thirdTopic, HEX_STANDARD.hex);

        transferOrder[tokenId] =
          HEX_STANDARD.hex_string +
          log.secondTopic.substring(
            LOG_USER_ADDRESS_STANDARD.user_address_start,
            LOG_USER_ADDRESS_STANDARD.user_address_end,
          );

        tokenIds.push(tokenId);
      }
      completeIds.push(log.id);
    }
    if (completeIds.length) {
      await this.shapeOwnerLogProvider.repository.updateStatus(completeIds);
    }

    if (!tokenIds.length) return;

    const shapes = await this.shapesRepository.findByTokenIds(tokenIds);

    for (const shape of shapes) {
      shape.owner = transferOrder[shape.tokenId];
    }

    await this.shapesRepository.save(shapes, { reload: false });
  }

  @TransactionalEx(DB_NAME.BATCH, DB_NAME.CONTRACT)
  async shapeGacha(): Promise<void> {
    const topics = await this.topicProvider.repository.findTopicByNames(
      this.TOPIC_SHAPE_MINT,
    );

    if (!topics.length) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.TOPIC_NOT_FOUND,
        this.TOPIC_SHAPE_MINT,
      );
    }

    const currentLogs =
      await this.shapeMintLogProvider.repository.findByTopicIds(
        topics.map((it) => {
          return it.id;
        }),
      );

    if (!currentLogs.length) return;

    //contracts
    const shapeGachaMachine = await this.web3.provider.createContract(
      CONTRACT.SHAPE_GACHA_MACHINE,
    );

    const batchSize = Number(100);
    const batchCount = Math.ceil(currentLogs.length / batchSize);

    let randomNumberContract = new Web3ContractDto();
    if (this._isRandomSeed) {
      randomNumberContract = await this.web3.provider.createContract(
        CONTRACT.RANDOM_SEED,
      );
    }

    for (let i = 1; i <= batchCount; i++) {
      const startIndex = (i - 1) * batchSize;
      const endIndex = batchCount <= 1 ? batchSize : i * batchSize;

      const slicedCurrentLogs = currentLogs
        .slice(startIndex, endIndex)
        .filter((log) => log.status === LOG_STATUS.REGISTERED);

      if (slicedCurrentLogs.length <= 0) {
        continue;
      }

      let requestIds;
      let statusArray;
      if (this._isRandomSeed()) {
        requestIds = slicedCurrentLogs.map((it) => {
          const parseInt = BigInt(JSON.parse(it.data)[0]);
          return parseInt.toString();
        });

        statusArray = await randomNumberContract.web3.methods
          .getRequestStatusMany(requestIds)
          .call();
      }

      const gacha = [];
      for (let i = 0; i < slicedCurrentLogs.length; i++) {
        const userAddress = slicedCurrentLogs[i].address;
        const gachaId = parseInt(
          slicedCurrentLogs[i].secondTopic,
          HEX_STANDARD.hex,
        );
        const tokenId = parseInt(
          slicedCurrentLogs[i].thirdTopic,
          HEX_STANDARD.hex,
        );
        let requestId = null;
        if (this._isRandomSeed()) {
          if (!statusArray[i]) {
            continue;
          }
          requestId = requestIds[i];
        } else {
          requestId = keccak256(Buffer.from(randomUUID(), 'utf8'));
        }
        if (
          slicedCurrentLogs.findIndex(
            (log) => log.thirdTopic === slicedCurrentLogs[i].thirdTopic,
          ) === i
        ) {
          gacha.push({
            gachaId: gachaId,
            userAddress: userAddress,
            shapeTokenId: tokenId,
            requestId: requestId,
          });
        }

        slicedCurrentLogs[i].status = LOG_STATUS.PROCESSED;
      }

      if (!gacha.length) return;

      const gachaShapeInput = gacha.map((it) => {
        return Object.values(it);
      });

      if (gachaShapeInput.length) {
        const tx =
          await shapeGachaMachine.web3.methods.gachaShape(gachaShapeInput);

        await this.web3.provider.signAndSendTransaction(shapeGachaMachine, tx);
      }

      await this.shapeMintLogProvider.repository.save(slicedCurrentLogs, {
        chunk: 1000,
        reload: false,
      });
    }
  }

  @TransactionalEx(DB_NAME.BATCH, DB_NAME.CONTRACT)
  async setShapeId(): Promise<void> {
    const topics = await this.topicProvider.repository.findTopicByNames(
      this.TOPIC_SHAPE_GACHA,
    );

    if (!topics.length) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.TOPIC_NOT_FOUND,
        this.TOPIC_SHAPE_GACHA,
      );
    }

    const currentLogs =
      await this.shapeEventLogProvider.repository.findByTopicIds(
        topics.map((it) => {
          return it.id;
        }),
      );

    if (!currentLogs.length) return;

    const shapes = [];
    const logIds = [];
    const addresses = [];
    for (const currentLog of currentLogs) {
      const tokenId = parseInt(currentLog.secondTopic, HEX_STANDARD.hex);
      const shapeId = parseInt(currentLog.thirdTopic, HEX_STANDARD.hex);

      shapes.push(
        ShapeEntity.create({
          owner: currentLog.address,
          shapeId,
          tokenId,
        }),
      );
      logIds.push(currentLog.id);
      addresses.push(currentLog.address);
    }

    await this.shapeEventLogProvider.repository.updateStatus(logIds);
    await this.shapesRepository.insert(shapes);

    const users = await this.usersRepository.findByAddresses(addresses);

    this.messageProvider.sendMessage(
      BATCH_MESSAGE_TYPE.ERC1155_CLAIM,
      [...new Set(users.map((it) => it.id))],
      'shape 뽑기 완료했습니다.',
    );
  }

  private _isRandomSeed(): boolean {
    return (
      [ENVIRONMENT.PRODUCTION].includes(NODE_ENV) &&
      this.web3.network == NETWORK.POLYGON
    );
  }
}
