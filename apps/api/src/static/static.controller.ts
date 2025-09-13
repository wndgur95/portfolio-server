import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { StaticService } from './static.service';

@ApiTags('static')
@Controller('api/static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('/data-name')
  @ApiResponseEntity({ summary: '데이터 종류' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataName(): ResponseEntity<string[]> {
    return ResponseEntity.ok().body(this.staticService.getStaticDataName());
  }

  @Get('/data/query/:name')
  @ApiResponseEntity({ summary: '이름 & 쿼리로 데이터 불러오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataByQuery(
    @Param('name') name: string,
    @Query() query: Record<string, string>,
  ): ResponseEntity<object> {
    return ResponseEntity.ok().body(
      this.staticService.getStaticDataByQuery(name, query),
    );
  }

  @Get('/data/:name')
  @ApiResponseEntity({ summary: '이름으로 데이터 가져오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticData(@Param('name') name: string): ResponseEntity<object[]> {
    return ResponseEntity.ok().body(this.staticService.getStaticData(name));
  }

  @Get('/data/:name/:id')
  @ApiResponseEntity({ summary: '이름 & id 로 데이터 불러오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataById(
    @Param('name') name: string,
    @Param('id') id: number,
  ): ResponseEntity<object> {
    return ResponseEntity.ok().body(
      this.staticService.getStaticDataById(name, Number(id)),
    );
  }
}
