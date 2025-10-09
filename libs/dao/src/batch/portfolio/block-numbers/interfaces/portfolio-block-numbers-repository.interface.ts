import { BlockNumbersRepository } from '@libs/dao/batch/abstract/block-numbers/interfaces/block-numbers-repository.interface';
import { PortfolioBlockNumberEntity } from '@libs/dao/batch/portfolio/block-numbers/entities/portfolio-block-number.entity';

export type PortfolioBlockNumbersRepository =
  BlockNumbersRepository<PortfolioBlockNumberEntity>;

// export interface PortfolioBlockNumbersRepository
//   extends BlockNumbersRepository<PortfolioBlockNumberEntity> {}

export const PortfolioBlockNumbersRepository = Symbol(
  'PortfolioBlockNumbersRepository',
);
