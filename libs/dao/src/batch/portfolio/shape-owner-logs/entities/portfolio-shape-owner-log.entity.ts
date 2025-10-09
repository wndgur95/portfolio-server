import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ShapeOwnerLogEntity } from '@libs/dao/batch/abstract/shape-owner-logs/entities/shape-owner-log.entity';
import { PortfolioShapeOwnerLog } from '@libs/dao/batch/portfolio/shape-owner-logs/interfaces/portfolio-shape-owner-log.interface';

@Entity('portfolio_shape_owner_log')
@BaseTimeEntity()
export class PortfolioShapeOwnerLogEntity
  extends ShapeOwnerLogEntity
  implements PortfolioShapeOwnerLog {}
