import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { ShapeEventLogsDbRepository } from '@libs/dao/batch/abstract/shape-event-logs/repositories/shape-event-logs-db.repository';
import { PortfolioShapeEventLogEntity } from '@libs/dao/batch/portfolio/shape-event-logs/entities/portfolio-shape-event-log.entity';
import { PortfolioShapeEventLogsRepository } from '@libs/dao/batch/portfolio/shape-event-logs/interfaces/portfolio-shape-event-logs-repository.interface';

@EntityRepository(PortfolioShapeEventLogEntity)
export class PortfolioShapeEventLogsDbRepository
  extends ShapeEventLogsDbRepository<PortfolioShapeEventLogEntity>
  implements PortfolioShapeEventLogsRepository {}
