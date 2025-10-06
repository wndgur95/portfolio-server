import { Inject, Injectable } from '@nestjs/common';
import { MetadataFormsDbRepository } from '@libs/dao/contract/metadata-forms/repositories/metadata-forms-db.repository';
import { MetadataFormsRepository } from '@libs/dao/contract/metadata-forms/interfaces/metadata-forms-repository.interface';

@Injectable()
export class TokenService {
  constructor(
    @Inject(MetadataFormsRepository)
    private readonly metadataFormsRepository: MetadataFormsDbRepository,
  ) {}
}
