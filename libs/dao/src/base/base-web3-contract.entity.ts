import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import {
  CONTRACT_TYPE,
  ContractType,
  GAME_TYPE,
} from '@libs/common/constants/contract.contstants';
import { AbstractEntity } from '@libs/common/databases/typeorm/abstract.entity';

export class BaseWeb3Contract extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('IDX_NAME')
  name: string;

  @Column({ default: GAME_TYPE.DEFAULT })
  game: string;

  @Column()
  @Index('IDX_ADDRESS')
  address: string;

  @Column({
    default: CONTRACT_TYPE.CONTRACT,
  })
  type: ContractType;

  @Column('simple-json', { nullable: true })
  abi: string;

  constructor(partial?: Partial<BaseWeb3Contract>) {
    super();
    Object.assign(this, partial);
  }
}
