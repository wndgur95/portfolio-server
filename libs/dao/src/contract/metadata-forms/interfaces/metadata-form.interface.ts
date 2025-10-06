import { Domain } from '@libs/common/domain/domain';

export interface MetadataForm extends Domain {
  name: string;
  metadataForm: string;
}
