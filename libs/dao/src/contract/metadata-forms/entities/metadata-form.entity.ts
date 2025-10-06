import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { MetadataForm } from '@libs/dao/contract/metadata-forms/interfaces/metadata-form.interface';

@Entity('metadata_form')
@BaseTimeEntity()
export class MetadataFormEntity extends AbstractEntity implements MetadataForm {
  @Column()
  name: string;

  @Column('simple-json', { nullable: true })
  metadataForm: string;
}
