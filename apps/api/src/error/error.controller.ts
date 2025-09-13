import { Controller, Post, UseGuards } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { ErrorService } from './error.service';

@ApiTags('error')
@Controller('api/error')
export class ErrorController {
  constructor(private readonly errorService: ErrorService) {}

  @Post('internal')
  @ApiResponseEntity({ summary: '인터널 에러' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  internalError(): ResponseEntity<unknown> {
    this.errorService.internalError();

    return ResponseEntity.ok().build();
  }

  @Post('unknown')
  @ApiResponseEntity({ summary: '언논 에러' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  unknownError(): ResponseEntity<unknown> {
    this.errorService.unknownError();

    return ResponseEntity.ok().build();
  }

  @Post('log/get')
  @ApiResponseEntity({ summary: '로그 가져오기' })
  @ApiSecurity('apiKey')
  @UseGuards(ApiKeyAuthGuard)
  async getLog(): Promise<ResponseEntity<string>> {
    const log = await this.errorService.getLog();

    return ResponseEntity.ok().body(log);
  }
}
