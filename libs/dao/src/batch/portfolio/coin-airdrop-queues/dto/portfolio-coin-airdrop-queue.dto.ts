import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { CoinAirdropQueueDto } from '@libs/dao/batch/abstract/coin-airdrop-queues/dto/coin-airdrop-queue.dto';

@EntitySerializeImpl()
export class PortfolioCoinAirdropQueueDto extends CoinAirdropQueueDto<PortfolioCoinAirdropQueueDto> {}
