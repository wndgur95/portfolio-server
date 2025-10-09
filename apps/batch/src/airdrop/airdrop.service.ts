import { Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';
import {
  AIRDROP_COIN_VALUE,
  CONTRACT,
  LOG_STATUS,
} from '@libs/common/constants/contract.contstants';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { MessageProvider } from '../message/message.provider';
import { BATCH_MESSAGE_TYPE } from '../message-kafka/interfaces/message-kafka-event.interface';

@Injectable()
export class AirdropService {
  constructor(
    private readonly web3: Web3Provider,

    private readonly coinAirdropQueueProvider: CoinAirdropQueueProvider,
    private readonly messageProvider: MessageProvider,
  ) {}

  @TransactionalEx(DB_NAME.BATCH)
  async airdropCoin(): Promise<void> {
    const queues = await this.coinAirdropQueueProvider.repository.findByStatus(
      LOG_STATUS.REGISTERED,
    );

    if (!queues.length) return;

    const now = ContextProvider.getNow();
    const airdropInfo = [];
    const userIds = [];
    for (const queue of queues) {
      airdropInfo.push([queue.address, AIRDROP_COIN_VALUE]);
      queue.receivedAt = now;
      queue.status = LOG_STATUS.PROCESSED;
      userIds.push(queue.userId);
    }

    this.messageProvider.sendMessage(
      BATCH_MESSAGE_TYPE.AIRDROP_COIN,
      userIds,
      '코인 에어드랍 시작했습니다.',
    );

    const airdropCoin = await this.web3.provider.createContract(
      CONTRACT.ADMIN_AIRDROP_COIN,
    );

    const tx = await airdropCoin.web3.methods.airdrop(airdropInfo);

    await this.web3.provider.signAndSendTransaction(airdropCoin, tx);

    await this.coinAirdropQueueProvider.repository.save(queues);

    this.messageProvider.sendMessage(
      BATCH_MESSAGE_TYPE.AIRDROP_COIN,
      userIds,
      '코인 에어드랍 완료했습니다.',
    );
  }
}
