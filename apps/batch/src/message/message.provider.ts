import { Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  BATCH_MESSAGE_TYPE,
  BatchMessageType,
} from '../message-kafka/interfaces/message-kafka-event.interface';

@Injectable()
export class MessageProvider {
  constructor(private readonly messageService: MessageService) {}

  sendMessage(type: BatchMessageType, userIds: number[], message: string): void {
    switch (type) {
      case BATCH_MESSAGE_TYPE.AIRDROP_COIN: {
        // `${userData.address}에게 ${AIRDROP_COIN_VALUE} 에어드랍 완료되었습니다.`
        this.messageService.producerAirdropCoin(userIds, message).then();
        break;
      }
      case BATCH_MESSAGE_TYPE.ERC1155_CLAIM: {
        // `${userData.address}에게 ${AIRDROP_COIN_VALUE} 에어드랍 완료되었습니다.`
        this.messageService.producerErc1155Claim(userIds, message).then();
      }
    }
  }
}
