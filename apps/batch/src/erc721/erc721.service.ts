import { Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { Erc1155ClaimMerkleTreeProvider } from '@libs/dao/batch/common/erc1155-claim-merkle-tree/erc1155-claim-merkle-tree.provider';
import { Erc1155ClaimProvider } from '@libs/dao/batch/common/erc1155-claim/erc1155-claim.provider';
import { MessageProvider } from '../message/message.provider';
import { ClaimErc1155LogProvider } from '@libs/dao/batch/common/claim-erc1155-log/claim-erc1155-log.provider';
import { TopicProvider } from '@libs/dao/batch/common/topic/topic.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ShapeOwnerLogProvider } from '@libs/dao/batch/common/shape-owner-log/shape-owner-log.provider';
import { DEFAULT_ADDRESS } from '@libs/common/constants/contract.contstants';
import { HEX_STANDARD, LOG_USER_ADDRESS_STANDARD } from '@libs/common/utils/web3.utils';

@Injectable()
export class Erc721Service {
  constructor(
    private readonly erc1155ClaimProvider: Erc1155ClaimProvider,
    private readonly erc1155ClaimMerkleTreeProvider: Erc1155ClaimMerkleTreeProvider,
    private readonly claimErc1155LogProvider: ClaimErc1155LogProvider,
    private readonly messageProvider: MessageProvider,

    private readonly shapeOwnerLogProvider: ShapeOwnerLogProvider,
    private readonly topicProvider: TopicProvider,
    private readonly web3: Web3Provider,
  ) {}

  private TOPIC_TRANSFER_OWNER = ['TransferOwner'];

  async transferOwner(): Promise<void> {
    const topics = await this.topicProvider.repository.findTopicByNames(
      this.TOPIC_TRANSFER_OWNER,
    );
    if (topics.length) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        'TOPIC_NOT_FOUND',
      ]);
    }
    const currentLogs = await this.shapeOwnerLogProvider.repository.findByTopicIds(
      topics.map((it) => {
        return it.id;
      }),
    );
    if (!currentLogs.length) return;

    const transferOrder = [];
    const completeIds = [];

    for (const log of currentLogs) {
      if (log.address == DEFAULT_ADDRESS.NULL_ADDRESS) {
        completeIds.push(log.id);
      } else {
        transferOrder.push({
          id: log.id,
          tokenId: parseInt(log.thirdTopic, HEX_STANDARD.hex),
          to: log.address,
          from:
            HEX_STANDARD.hex_string +
            log.secondTopic.substring(
              LOG_USER_ADDRESS_STANDARD.user_address_start,
              LOG_USER_ADDRESS_STANDARD.user_address_end,
            ),
        });
      }
    }
    if (completeIds.length) {
      await this.shapeOwnerLogProvider.repository.updateStatus(completeIds);
    }

    for (let offset = 0; offset < transferOrder.length; offset += 100) {
      await this.shapeOwnerLogProvider.repository.updateStatus(
        transferOrder,
      );
    }
  }
}
