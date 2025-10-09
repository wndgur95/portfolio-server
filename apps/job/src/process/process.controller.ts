import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/api-key-auth.guard';
import { IsOpenInfo, ProcessInfoOutDto } from './dto/process-info-out.dto';
import { GetTimeOutDto } from './dto/get-time-out.dto';
import { SetTimeInDto } from './dto/set-time-in.dto';
import { ProcessProvider } from './process.provider';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { JobProcessInfoDto } from '../dto/job-process-info.dto';
import { PortfolioImportLogService } from '../portfolio/import-log/portfolio-import-log.service';
import { PortfolioAirdropService } from '../portfolio/airdrop/portfolio-airdrop.service';

@ApiTags('process info')
@Controller('process')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class ProcessController {
  constructor(
    private readonly processProvider: ProcessProvider,
    private readonly portfolioImportLogService: PortfolioImportLogService,
    private readonly portfolioAirdropService: PortfolioAirdropService,
  ) {}

  @Get('/:network')
  @ApiResponseEntity({ summary: 'process 정보' })
  async getProcess(
    @Param('network') network: string,
  ): Promise<ResponseEntity<ProcessInfoOutDto>> {
    let processInfo: JobProcessInfoDto[];

    switch (network) {
      case NETWORK.POLYGON:
        {
          processInfo = this.polygonProcess();
        }
        break;
      case NETWORK.IMMUTABLE:
        {
          processInfo = this.immutableProcess();
        }
        break;
      default: {
        processInfo = this.portfolioProcess();
      }
    }

    return ResponseEntity.ok().body(
      ProcessInfoOutDto.of(
        processInfo,
        IsOpenInfo.of(
          this.processProvider.getIsOpen(),
          this.processProvider.isAvailableTime(),
          this.processProvider.getJobOpen(network),
        ),
      ),
    );
  }

  polygonProcess(): JobProcessInfoDto[] {
    return [];
  }

  immutableProcess(): JobProcessInfoDto[] {
    return [];
  }

  portfolioProcess(): JobProcessInfoDto[] {
    return [
      ...this.portfolioImportLogService.getProcess(),
      ...this.portfolioAirdropService.getProcess(),
    ];
  }

  @Post('/set/is-open')
  @ApiResponseEntity({ summary: 'job 강제 오픈' })
  async setIsOpen(): Promise<ResponseEntity<unknown>> {
    this.processProvider.setIsOpen();
    return ResponseEntity.ok().build();
  }

  @Get('/get/time')
  @ApiResponseEntity({ summary: '오픈 시간' })
  async getTime(): Promise<ResponseEntity<GetTimeOutDto>> {
    return ResponseEntity.ok().body(
      GetTimeOutDto.of(
        this.processProvider.getCurrentHour(),
        this.processProvider.getStartHour(),
        this.processProvider.getEndHour(),
      ),
    );
  }

  @Post('/set/time')
  @ApiResponseEntity({ summary: '오픈 시간 설정' })
  async setTime(
    @Body() setTimeInDto: SetTimeInDto,
  ): Promise<ResponseEntity<unknown>> {
    this.processProvider.setStartHour(setTimeInDto.startHour);
    this.processProvider.setEndHour(setTimeInDto.endHour);
    return ResponseEntity.ok().build();
  }
}
