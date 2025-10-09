import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ShapeMintLogEntity } from '@libs/dao/batch/abstract/shape-mint-logs/entities/shape-mint-log.entity';
import { PortfolioShapeMintLog } from '@libs/dao/batch/portfolio/shape-mint-logs/interfaces/portfolio-shape-mint-log.interface';

@Entity('portfolio_shape_mint_log')
@BaseTimeEntity()
export class PortfolioShapeMintLogEntity
  extends ShapeMintLogEntity
  implements PortfolioShapeMintLog {}
