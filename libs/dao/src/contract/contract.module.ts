import { Module } from '@nestjs/common';
import { ImmutableContractsModule } from '@libs/dao/contract/immutable-contracts/immutable-contracts.module';
import { PolygonContractsModule } from '@libs/dao/contract/polygon-contracts/polygon-contracts.module';
import { PortfolioContractsModule } from '@libs/dao/contract/portfolio-contracts/portfolio-contracts.module';
import { MetadataFormsModule } from '@libs/dao/contract/metadata-forms/metadata-forms.module';
import { ShapesModule } from '@libs/dao/contract/shapes/shapes.module';

@Module({
  imports: [
    ImmutableContractsModule,
    PolygonContractsModule,
    PortfolioContractsModule,

    MetadataFormsModule,
    ShapesModule,
  ],
  exports: [
    ImmutableContractsModule,
    PolygonContractsModule,
    PortfolioContractsModule,

    MetadataFormsModule,
    ShapesModule,
  ],
})
export class ContractModule {}
