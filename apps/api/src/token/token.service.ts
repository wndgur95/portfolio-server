import { Inject, Injectable } from '@nestjs/common';
import { MetadataFormsDbRepository } from '@libs/dao/contract/metadata-forms/repositories/metadata-forms-db.repository';
import { MetadataFormsRepository } from '@libs/dao/contract/metadata-forms/interfaces/metadata-forms-repository.interface';
import {
  S_TOKEN_TIER_TYPE,
  TOKEN_NAME,
} from '@libs/common/constants/contract.contstants';
import { ShapeAttributeDto, ShapeMetadataDto } from './dto/shape-metadata.dto';
import { ShapesDbRepository } from '@libs/dao/contract/shapes/repositories/shapes-db.repository';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';
import { Shape } from '@libs/dao/contract/shapes/interfaces/shape.interface';
import { DataShapeToken } from '@libs/dao/static/data-shape-token/data-shape-token.entity';
import { DataShapeTokenRepository } from '@libs/dao/static/data-shape-token/data-shape-token.repository';
import { snakeToCamel } from 'google-auth-library/build/src/util';
import { DataNumberTokenRepository } from '@libs/dao/static/data-number-token/data-number-token.repository';
import { DataGachaTokenRepository } from '@libs/dao/static/data-gacha-token/data-gacha-token.repository';
import { DataNumberToken } from '@libs/dao/static/data-number-token/data-number-token.entity';
import {
  NumberAttributeDto,
  NumberMetadataDto,
} from './dto/number-metadata.dto';
import { GachaAttributeDto, GachaMetadataDto } from './dto/gacha-metadata.dto';

@Injectable()
export class TokenService {
  constructor(
    @Inject(MetadataFormsRepository)
    private readonly metadataFormsRepository: MetadataFormsDbRepository,

    @Inject(ShapesRepository)
    private readonly shapesRepository: ShapesDbRepository,

    private readonly dataShapeTokenRepository: DataShapeTokenRepository,
    private readonly dataNumberTokenRepository: DataNumberTokenRepository,
    private readonly dataGachaTokenRepository: DataGachaTokenRepository,
  ) {}

  async getMetadataByToken(
    tokenName: string,
    tokenId: number,
  ): Promise<unknown> {
    const metadataForm =
      await this.metadataFormsRepository.findByName(tokenName);
    const form = JSON.parse(metadataForm.metadataForm);
    switch (tokenName) {
      case TOKEN_NAME.SHAPE: {
        const shape = await this.shapesRepository.findByTokenId(tokenId);

        return this.getShapeMetadata(shape, form);
      }
      case TOKEN_NAME.GACHA: {
        return this.getGachaMetadata(tokenId, form);
      }
      case TOKEN_NAME.NUMBER: {
        return this.getNumberMetadata(tokenId, form);
      }
    }
  }

  getShapeMetadata(shape: Shape, form: any): ShapeMetadataDto {
    const shapeData = this.dataShapeTokenRepository.findById(shape.shapeId);

    const attributesDto = form.attributes.map((it) => {
      return new ShapeAttributeDto({
        trait_type: it.trait_type,
        value: this._getShapeAttribute(it, shape, shapeData),
      });
    });

    return ShapeMetadataDto.of(form, shape, shapeData, attributesDto);
  }

  getNumberMetadata(tokenId: number, form: any): NumberMetadataDto {
    const numberData = this.dataNumberTokenRepository.findById(tokenId);

    const attributesDto = form.attributes.map((it) => {
      return new NumberAttributeDto({
        trait_type: it.trait_type,
        value: this._getNumberAttribute(it, numberData),
      });
    });

    return NumberMetadataDto.of(form, numberData, attributesDto);
  }

  getGachaMetadata(tokenId: number, form: any): GachaMetadataDto {
    const gachaData = this.dataGachaTokenRepository.findById(tokenId);
    const tierRatioSum = gachaData.TIER_RATIO.sum();

    const attributesDto = form.attributes.map((it, index) => {
      return new GachaAttributeDto({
        trait_type: it.trait_type,
        value: `${(gachaData.TIER_RATIO[index] / tierRatioSum) * 100}%`,
      });
    });

    return GachaMetadataDto.of(form, gachaData, attributesDto);
  }

  private _getShapeAttribute(
    schema: any,
    shape: Shape,
    data: DataShapeToken,
  ): any {
    if (schema.value === '?') return shape[snakeToCamel(schema.trait_type)];

    if (schema.value === 'static') {
      return data[snakeToCamel(schema.trait_type).toUpperCase()];
    }

    if (schema.value === 'static_tier') {
      return S_TOKEN_TIER_TYPE[
        data[snakeToCamel(schema.trait_type).toUpperCase()]
      ];
    }

    return schema.value;
  }

  private _getNumberAttribute(schema: any, data: DataNumberToken): any {
    if (schema.value === 'static') {
      return data[snakeToCamel(schema.trait_type).toUpperCase()];
    }

    if (schema.value === 'static_tier') {
      return S_TOKEN_TIER_TYPE[
        data[snakeToCamel(schema.trait_type).toUpperCase()]
      ];
    }

    return schema.value;
  }
}
