import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { ShapeMintLogsDbRepository } from '@libs/dao/batch/abstract/shape-mint-logs/repositories/shape-mint-logs-db.repository';
import { PortfolioShapeMintLogsRepository } from '@libs/dao/batch/portfolio/shape-mint-logs/interfaces/portfolio-shape-mint-logs-repository.interface';
import { PortfolioShapeMintLogEntity } from '@libs/dao/batch/portfolio/shape-mint-logs/entities/portfolio-shape-mint-log.entity';

@EntityRepository(PortfolioShapeMintLogEntity)
export class PortfolioShapeMintLogsDbRepository
  extends ShapeMintLogsDbRepository<PortfolioShapeMintLogEntity>
  implements PortfolioShapeMintLogsRepository {}
