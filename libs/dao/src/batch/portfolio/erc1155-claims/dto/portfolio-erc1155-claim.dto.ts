import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { Erc1155ClaimDto } from '@libs/dao/batch/abstract/erc1155-claims/dto/erc1155-claim.dto';

@EntitySerializeImpl()
export class PortfolioErc1155ClaimDto extends Erc1155ClaimDto<PortfolioErc1155ClaimDto> {}
