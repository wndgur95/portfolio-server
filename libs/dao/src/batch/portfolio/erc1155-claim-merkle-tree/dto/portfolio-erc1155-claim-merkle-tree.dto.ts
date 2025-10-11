import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { Erc1155ClaimMerkleTreeDto } from '@libs/dao/batch/abstract/erc1155-claim-merkle-tree/dto/erc1155-claim-merkle-tree.dto';

@EntitySerializeImpl()
export class PortfolioErc1155ClaimMerkleTreeDto extends Erc1155ClaimMerkleTreeDto<PortfolioErc1155ClaimMerkleTreeDto> {}
