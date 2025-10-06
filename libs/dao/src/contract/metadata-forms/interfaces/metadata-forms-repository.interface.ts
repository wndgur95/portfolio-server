import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { MetadataFormEntity } from '@libs/dao/contract/metadata-forms/entities/metadata-form.entity';
import { MetadataForm } from '@libs/dao/contract/metadata-forms/interfaces/metadata-form.interface';

export interface MetadataFormsRepository
  extends AbstractRepositoryInterface<MetadataFormEntity> {
  findByName(name: string): Promise<MetadataForm>;
}

export const MetadataFormsRepository = Symbol('MetadataFormsRepository');
