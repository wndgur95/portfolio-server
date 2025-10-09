import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { ShapeEventLogEntity } from '@libs/dao/batch/abstract/shape-event-logs/entities/shape-event-log.entity';
import { PortfolioShapeEventLog } from '@libs/dao/batch/portfolio/shape-event-logs/interfaces/portfolio-shape-event-log.interface';

@Entity('portfolio_shape_event_log')
@BaseTimeEntity()
export class PortfolioShapeEventLogEntity
  extends ShapeEventLogEntity
  implements PortfolioShapeEventLog {}
