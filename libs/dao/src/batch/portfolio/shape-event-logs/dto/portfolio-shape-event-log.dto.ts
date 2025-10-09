import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ShapeEventLogDto } from '@libs/dao/batch/abstract/shape-event-logs/dto/shape-event-log.dto';

@EntitySerializeImpl()
export class PortfolioShapeEventLogDto extends ShapeEventLogDto<PortfolioShapeEventLogDto> {}
