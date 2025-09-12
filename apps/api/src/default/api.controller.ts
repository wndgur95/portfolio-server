import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { GetApiKeyOutDto } from '../auth/dto/get-api-key-out.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<any> {
    return ResponseEntity.ok().body(this.apiService.health());
  }

  @Get('/static-data-name')
  @ApiResponseEntity({ summary: '데이터 종류' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataName(): ResponseEntity<string[]> {
    return ResponseEntity.ok().body(this.apiService.getStaticdataName());
  }

  @Get('/static-data/query/:name')
  @ApiResponseEntity({ summary: '이름 & 쿼리로 데이터 불러오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataByQuery(
    @Param('name') name: string,
    @Query() query: Record<string, string>,
  ): ResponseEntity<object> {
    return ResponseEntity.ok().body(
      this.apiService.getStaticdataByQuery(name, query),
    );
  }

  @Get('/static-data/:name')
  @ApiResponseEntity({ summary: '이름으로 데이터 가져오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticData(@Param('name') name: string): ResponseEntity<object[]> {
    return ResponseEntity.ok().body(this.apiService.getStaticData(name));
  }

  @Get('/static-data/:name/:id')
  @ApiResponseEntity({ summary: '이름 & id 로 데이터 불러오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  getStaticDataById(
    @Param('name') name: string,
    @Param('id') id: number,
  ): ResponseEntity<object> {
    return ResponseEntity.ok().body(
      this.apiService.getStaticdataById(name, Number(id)),
    );
  }
}
