import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { ShapeOwnerLogsDbRepository } from '@libs/dao/batch/abstract/shape-owner-logs/repositories/shape-owner-logs-db.repository';
import { PortfolioShapeOwnerLogEntity } from '@libs/dao/batch/portfolio/shape-owner-logs/entities/portfolio-shape-owner-log.entity';
import { PortfolioShapeOwnerLogsRepository } from '@libs/dao/batch/portfolio/shape-owner-logs/interfaces/portfolio-shape-owner-logs-repository.interface';

@EntityRepository(PortfolioShapeOwnerLogEntity)
export class PortfolioShapeOwnerLogsDbRepository
  extends ShapeOwnerLogsDbRepository<PortfolioShapeOwnerLogEntity>
  implements PortfolioShapeOwnerLogsRepository {}
