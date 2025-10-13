import { Injectable } from '@nestjs/common';
import { Log } from 'web3-core';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { TopicProvider } from '@libs/dao/batch/common/topic/topic.provider';
import { BlockNumberProvider } from '@libs/dao/batch/common/block-number/block-number.provider';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { BaseWeb3Contract } from '@libs/dao/base/base-web3-contract.entity';
import { PortfolioTopic } from '@libs/dao/batch/portfolio/topics/interfaces/portfolio-topic.interface';
import {
  getLogData,
  getUserAddress,
  HEX_STANDARD,
  LOG_USER_ADDRESS_STANDARD,
} from '@libs/common/utils/web3.utils';
import {
  DEFAULT_ADDRESS,
  TOPIC_TYPE,
  TopicType,
} from '@libs/common/constants/contract.contstants';
import { ShapeMintLogProvider } from '@libs/dao/batch/common/shape-mint-log/shape-mint-log.provider';
import { ShapeEventLogProvider } from '@libs/dao/batch/common/shape-event-log/shape-event-log.provider';
import { ShapeOwnerLogProvider } from '@libs/dao/batch/common/shape-owner-log/shape-owner-log.provider';
import { ClaimErc1155LogEntity } from '@libs/dao/batch/abstract/claim-erc1155-logs/entities/claim-erc1155-log.entity';
import { ClaimErc1155LogProvider } from '@libs/dao/batch/common/claim-erc1155-log/claim-erc1155-log.provider';

@Injectable()
export class ImportLogService {
  constructor(
    private readonly web3: Web3Provider,
    private readonly topic: TopicProvider,
    private readonly blockNumber: BlockNumberProvider,

    private readonly shapeMintLogProvider: ShapeMintLogProvider,
    private readonly shapeEventLogProvider: ShapeEventLogProvider,
    private readonly shapeOwnerLogProvider: ShapeOwnerLogProvider,
    private readonly claimErc1155LogProvider: ClaimErc1155LogProvider,
  ) {}

  /**
   * 등록된 컨트랙트의 이벤트 fromBlock ~ toBlock 까지의 이벤트 로그를 추출하여 등록함.
   */
  @TransactionalEx(DB_NAME.BATCH)
  async importLog(toBlockNumber: number, topicType: number): Promise<void> {
    // console.log(
    //   toBlockNumber,
    //   topicType,
    //   this.requestContextProvider.getNetwork(),
    // );
    const topicAndTopicEntityMap = {};
    const contractAddressAndContractEntityMap = {};
    const contractAddressAndTopicEntitiesMap = {};
    const topics = await this.topic.repository.findTopicsByTopicType(topicType);
    const blockNumber =
      await this.blockNumber.repository.findByTopicType(topicType);
    if (
      !topics.length ||
      !blockNumber ||
      !toBlockNumber ||
      toBlockNumber <= blockNumber.blockNumber
    ) {
      return;
    }
    for (const topic of topics) {
      const contract = await this.web3.repository.findById(topic.contractId);
      contractAddressAndContractEntityMap[contract.address] = contract;
      if (!contractAddressAndTopicEntitiesMap[contract.address]) {
        contractAddressAndTopicEntitiesMap[contract.address] = [];
      }

      topicAndTopicEntityMap[topic.topic] = topic;
      contractAddressAndTopicEntitiesMap[contract.address].push(topic);
    }

    const subscriptions = Object.values(contractAddressAndContractEntityMap)
      .map((contract: BaseWeb3Contract) => {
        if (contractAddressAndTopicEntitiesMap[contract.address].length > 0) {
          return contractAddressAndTopicEntitiesMap[contract.address].map(
            (topic: PortfolioTopic): Promise<Log[]> => {
              return this.web3.provider.subscription({
                address: contract.address,
                fromBlockNumber: blockNumber.blockNumber + 1,
                toBlockNumber: toBlockNumber === 0 ? 'latest' : toBlockNumber,
                topics: topic.topic,
              });
            },
          );
        }
      })
      ?.flat(1);

    const logs = (await Promise.all(subscriptions))?.flat(1);
    const blockNumberAndEventLogs: Record<number, any[]> = {};
    logs.forEach((log) => {
      if (!blockNumberAndEventLogs[topicType]) {
        blockNumberAndEventLogs[topicType] = [];
      }
      blockNumberAndEventLogs[topicType].push(
        this._getEntity(topicType, {
          address: getUserAddress(log),
          secondTopic:
            log.topics[LOG_USER_ADDRESS_STANDARD.second_topic_index] ?? '',
          thirdTopic:
            log.topics[LOG_USER_ADDRESS_STANDARD.third_topic_index] ?? '',
          contractId: contractAddressAndContractEntityMap[log.address].id,
          topicId: topicAndTopicEntityMap[log.topics[0]].id,
          blockNumber: log.blockNumber,
          data: JSON.stringify(getLogData(log.data)),
        }),
      );
      // blockNumber.blockNumber =
      //   blockNumber.blockNumber < log.blockNumber
      //     ? log.blockNumber
      //     : blockNumber.blockNumber;
    });
    blockNumber.blockNumber = toBlockNumber;

    await this._insertLogByTopicType(blockNumberAndEventLogs);
    await this.blockNumber.repository.updateBlockNumber(
      blockNumber.id,
      blockNumber.blockNumber,
    );
  }

  private async _insertLogByTopicType(
    blockNumberAndEventLogs: Record<string, any[]>,
  ): Promise<void> {
    for (const [key, value] of Object.entries(blockNumberAndEventLogs)) {
      switch (Number(key)) {
        case TOPIC_TYPE.MINT:
          {
            await this.shapeMintLogProvider.repository.insert(value);
          }
          break;
        case TOPIC_TYPE.OWNER:
          {
            const ownerLogs = value.filter((it) => {
              return it.address != DEFAULT_ADDRESS.NULL_ADDRESS;
            });
            if (ownerLogs.length) {
              await this.shapeOwnerLogProvider.repository.insert(ownerLogs);
            }
          }
          break;
        case TOPIC_TYPE.SHAPE:
          {
            await this.shapeEventLogProvider.repository.insert(value);
          }
          break;
        case TOPIC_TYPE.CLAIM_ERC1155:
        {
          await this.claimErc1155LogProvider.repository.insert(value);
        }
          break;
      }
    }
  }

  private _getEntity(topicType: TopicType, eventLog: any): any {
    switch (topicType) {
      case TOPIC_TYPE.MINT: {
        return this.shapeMintLogProvider.createEntity(eventLog);
      }
      case TOPIC_TYPE.OWNER: {
        return this.shapeOwnerLogProvider.createEntity(eventLog);
      }
      case TOPIC_TYPE.SHAPE: {
        return this.shapeEventLogProvider.createEntity(eventLog);
      }
      case TOPIC_TYPE.CLAIM_ERC1155: {
        return this._getClaimErc1155Entity(eventLog);
      }
    }
  }

  private _getClaimErc1155Entity(eventLog: any): ClaimErc1155LogEntity {
    return this.claimErc1155LogProvider.createEntity({
      address: eventLog.address,
      claimId: parseInt(eventLog.secondTopic, HEX_STANDARD.hex),
      tokenId: parseInt(eventLog.thirdTopic, HEX_STANDARD.hex),
      contractId: eventLog.contractId,
      topicId: eventLog.topicId,
      blockNumber: eventLog.blockNumber,
      data: eventLog.data,
    });
  }
}
