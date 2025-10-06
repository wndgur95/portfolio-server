import { Repository } from 'typeorm';
import { ContractType } from '@libs/common/constants/contract.contstants';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';

export abstract class BaseWeb3ContractRepository<T> extends AbstractRepository<T> {
  protected abstract table: string;

  async findById(id: number): Promise<T> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.id=:id`, { id: id })
      .getOne();
  }

  async findByAirdropType(): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.type != :type`, { type: 'CONTRACT' })
      .getMany();
  }

  async findByName(name: string): Promise<T> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.name = :name`, { name: name })
      .getOne();
  }

  async findManyByName(name: string): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.name = :name`, { name: name })
      .getMany();
  }

  async findByNames(names: string[]): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.name IN (:names)`, { names: names })
      .getMany();
  }

  async findByAddresses(addresses: string[]): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.address IN (:addresses)`, { addresses: addresses })
      .getMany();
  }

  async findByType(type: ContractType): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.type = :type`, { type: type })
      .getMany();
  }

  async findByTypes(types: ContractType[]): Promise<T[]> {
    return await this.createQueryBuilder(this.table)
      .where(`${this.table}.type IN (:...types)`, { types: types })
      .getMany();
  }
}
