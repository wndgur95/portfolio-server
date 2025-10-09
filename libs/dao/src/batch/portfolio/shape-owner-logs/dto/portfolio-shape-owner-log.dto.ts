import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ShapeOwnerLogDto } from '@libs/dao/batch/abstract/shape-owner-logs/dto/shape-owner-log.dto';

@EntitySerializeImpl()
export class PortfolioShapeOwnerLogDto extends ShapeOwnerLogDto<PortfolioShapeOwnerLogDto> {}
