import { Injectable } from '@nestjs/common';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TimeUtil } from '@libs/common/utils/time.util';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';

@Injectable()
export class AirdropService {
  constructor(
    private readonly coinAirdropQueueProvider: CoinAirdropQueueProvider,
  ) {}

  @Transactional(DB_NAME.BATCH)
  async airdropCoinQueueRegister(): Promise<void> {
    const { address, userId } = ContextProvider.getJwt();
    const now = ContextProvider.getNow();

    const queue =
      (await this.coinAirdropQueueProvider.repository.findByAddress(address)) ??
      this.coinAirdropQueueProvider.createEntity({
        userId: userId,
        address: address,
      });

    if (queue.receivedAt && !TimeUtil.isChangeDay(queue.receivedAt, now)) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.TODAY_ALREADY_RECEIVED_AIRDROP,
      );
    }

    queue.status = LOG_STATUS.REGISTERED;

    await this.coinAirdropQueueProvider.repository.save(queue, {
      reload: false,
    });
  }
}
