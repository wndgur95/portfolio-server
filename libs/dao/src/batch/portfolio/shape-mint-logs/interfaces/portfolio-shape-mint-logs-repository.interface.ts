import { ShapeMintLogsRepository } from '@libs/dao/batch/abstract/shape-mint-logs/interfaces/shape-mint-logs-repository.interface';
import { PortfolioShapeMintLogEntity } from '@libs/dao/batch/portfolio/shape-mint-logs/entities/portfolio-shape-mint-log.entity';

// export interface PortfolioShapeMintLogsRepository
//   extends ShapeMintLogsRepository<PortfolioShapeMintLogEntity> {}

export type PortfolioShapeMintLogsRepository =
  ShapeMintLogsRepository<PortfolioShapeMintLogEntity>;

export const PortfolioShapeMintLogsRepository = Symbol(
  'PortfolioShapeMintLogsRepository',
);
