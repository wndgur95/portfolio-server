import { ShapeEventLogsRepository } from '@libs/dao/batch/abstract/shape-event-logs/interfaces/shape-event-logs-repository.interface';
import { PortfolioShapeEventLogEntity } from '@libs/dao/batch/portfolio/shape-event-logs/entities/portfolio-shape-event-log.entity';

// export interface PortfolioShapeEventLogsRepository
//   extends ShapeEventLogsRepository<PortfolioShapeEventLogEntity> {}

export type PortfolioShapeEventLogsRepository =
  ShapeEventLogsRepository<PortfolioShapeEventLogEntity>;

export const PortfolioShapeEventLogsRepository = Symbol(
  'PortfolioShapeEventLogsRepository',
);
