import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MongoLogService } from './mongo-log.service';
import { CreateMongoLogInDto } from './dto/create-mongo-log-in.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { NfTokenGuard } from '../auth/guard/nf-token.guard';
import { ResponseEntity } from '@libs/common/network/response-entity';

@Controller('log/mongo')
@ApiTags('Mongo')
export class MongoLogController {
  constructor(private readonly mongoLogService: MongoLogService) {}

  @Post()
  @ApiResponseEntity({ summary: '공통 로그' })
  @UseGuards(NfTokenGuard)
  @ApiSecurity('nfToken')
  @ApiHeader({ name: 'gameCd' })
  async setLog(
    @Headers('gameCd') gameCd: string,
    @Body() createMongoLogInDto: CreateMongoLogInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.mongoLogService.setMongoLog(createMongoLogInDto);

    return ResponseEntity.ok().build();
  }
}
