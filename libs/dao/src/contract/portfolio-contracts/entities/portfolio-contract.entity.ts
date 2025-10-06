import { Entity } from 'typeorm'
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { PortfolioContract } from '@libs/dao/contract/portfolio-contracts/interfaces/portfolio-contract.interface';
import { BaseWeb3Contract } from '@libs/dao/base/base-web3-contract.entity';

@Entity('portfolio_contract')
@BaseTimeEntity()
export class PortfolioContractEntity extends BaseWeb3Contract implements PortfolioContract {
  constructor(partial?: Partial<PortfolioContract>) {
    super(partial);
    Object.assign(this, partial);
  }
}