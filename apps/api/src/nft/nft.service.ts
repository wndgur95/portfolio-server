import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { MetadataFormsRepository } from '@libs/dao/contract/metadata-forms/interfaces/metadata-forms-repository.interface';
import { MetadataFormsDbRepository } from '@libs/dao/contract/metadata-forms/repositories/metadata-forms-db.repository';
import { TOKEN_NAME } from '@libs/common/constants/contract.contstants';
import { DataGachaTokenRepository } from '@libs/dao/static/data-gacha-token/data-gacha-token.repository';
import { DataNumberTokenRepository } from '@libs/dao/static/data-number-token/data-number-token.repository';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';
import { ShapesDbRepository } from '@libs/dao/contract/shapes/repositories/shapes-db.repository';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class NftService {
  constructor(
    @Inject(MetadataFormsRepository)
    private readonly metadataFormsRepository: MetadataFormsDbRepository,
    @Inject(ShapesRepository)
    private readonly shapesRepository: ShapesDbRepository,

    private readonly dataGachaTokenRepository: DataGachaTokenRepository,
    private readonly dataNumberTokenRepository: DataNumberTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async getShapeTokens(): Promise<object[]> {
    const { userId } = ContextProvider.getJwt();
    const metadataForm = await this.metadataFormsRepository.findByName(
      TOKEN_NAME.SHAPE,
    );
    const form = JSON.parse(metadataForm.metadataForm);

    const shapes = await this.shapesRepository.findByUserId(userId);

    return shapes.map((shape) => {
      return this.tokenService.getShapeMetadata(shape, form);
    });
  }

  async getGachaTokens(): Promise<object[]> {
    const metadataForm = await this.metadataFormsRepository.findByName(
      TOKEN_NAME.GACHA,
    );
    const form = JSON.parse(metadataForm.metadataForm);

    const tokenIds = this.dataGachaTokenRepository.values().map((it) => it.ID);

    return tokenIds.map((tokenId) => {
      return this.tokenService.getGachaMetadata(tokenId, form);
    });
  }

  async getNumberTokens(): Promise<object[]> {
    const metadataForm = await this.metadataFormsRepository.findByName(
      TOKEN_NAME.NUMBER,
    );
    const form = JSON.parse(metadataForm.metadataForm);

    const tokenIds = this.dataNumberTokenRepository.values().map((it) => it.ID);

    return tokenIds.map((tokenId) => {
      return this.tokenService.getNumberMetadata(tokenId, form);
    });
  }
}
