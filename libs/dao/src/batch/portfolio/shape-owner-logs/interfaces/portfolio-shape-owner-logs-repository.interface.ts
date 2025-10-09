import { ShapeOwnerLogsRepository } from '@libs/dao/batch/abstract/shape-owner-logs/interfaces/shape-owner-logs-repository.interface';
import { PortfolioShapeOwnerLogEntity } from '@libs/dao/batch/portfolio/shape-owner-logs/entities/portfolio-shape-owner-log.entity';

// export interface PortfolioShapeOwnerLogsRepository extends ShapeOwnerLogsRepository<PortfolioShapeOwnerLogEntity> {}
export type PortfolioShapeOwnerLogsRepository =
  ShapeOwnerLogsRepository<PortfolioShapeOwnerLogEntity>;

export const PortfolioShapeOwnerLogsRepository = Symbol(
  'PortfolioShapeOwnerLogsRepository',
);
