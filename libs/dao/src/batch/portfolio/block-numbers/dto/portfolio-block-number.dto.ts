import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { BlockNumberDto } from '@libs/dao/batch/abstract/block-numbers/dto/block-number.dto';

@EntitySerializeImpl()
export class PortfolioBlockNumberDto extends BlockNumberDto<PortfolioBlockNumberDto> {}
