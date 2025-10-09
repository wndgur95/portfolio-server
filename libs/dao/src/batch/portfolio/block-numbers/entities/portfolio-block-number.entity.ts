import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { BlockNumberEntity } from '@libs/dao/batch/abstract/block-numbers/entities/block-number.entity';
import { PortfolioBlockNumber } from '@libs/dao/batch/portfolio/block-numbers/interfaces/portfolio-block-number.interface';

@Entity('portfolio_block_number')
@BaseTimeEntity()
export class PortfolioBlockNumberEntity
  extends BlockNumberEntity
  implements PortfolioBlockNumber {}
