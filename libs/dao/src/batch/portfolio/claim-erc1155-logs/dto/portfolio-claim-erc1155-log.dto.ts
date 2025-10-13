import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ClaimErc1155LogDto } from '@libs/dao/batch/abstract/claim-erc1155-logs/dto/claim-erc1155-log.dto';

@EntitySerializeImpl()
export class PortfolioClaimErc1155LogDto extends ClaimErc1155LogDto<PortfolioClaimErc1155LogDto> {}
