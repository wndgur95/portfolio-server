import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ShapeMintLogDto } from '@libs/dao/batch/abstract/shape-mint-logs/dto/shape-mint-log.dto';

@EntitySerializeImpl()
export class PortfolioShapeMintLogDto extends ShapeMintLogDto<PortfolioShapeMintLogDto> {}
