import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { BlockNumbersDbRepository } from '@libs/dao/batch/abstract/block-numbers/repositories/block-numbers-db.repository';
import { PortfolioBlockNumberEntity } from '@libs/dao/batch/portfolio/block-numbers/entities/portfolio-block-number.entity';
import { PortfolioBlockNumbersRepository } from '@libs/dao/batch/portfolio/block-numbers/interfaces/portfolio-block-numbers-repository.interface';

@EntityRepository(PortfolioBlockNumberEntity)
export class PortfolioBlockNumbersDbRepository
  extends BlockNumbersDbRepository<PortfolioBlockNumberEntity>
  implements PortfolioBlockNumbersRepository {}
