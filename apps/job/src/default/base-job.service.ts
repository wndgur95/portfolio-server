import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { BaseJobDto } from './base-job.dto';
import { JobProcessInfoDto } from '../dto/job-process-info.dto';

@Injectable()
export abstract class BaseJobService {
  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly network: string,
    protected readonly processProvider,
  ) {}

  protected createJob(name: string, time: string, fun): void {
    const job = new CronJob(time, fun);
    this.schedulerRegistry.addCronJob(`${this.network}_${name}`, job);
    job.start();
  }

  protected deleteJob(name: string): void {
    this.schedulerRegistry.deleteCronJob(`${this.network}_${name}`);
  }

  protected async startJob(
    dto: BaseJobDto,
    fun: (() => Promise<void>)[],
  ): Promise<void> {
    if (dto.isProcess || !this.processProvider.getJobOpen(this.network)) return;
    dto.isProcess = true;
    try {
      await Promise.all(fun.map(async (fn) => await fn()));
      dto.lastTime = new Date();
    } catch (e) { /* empty */ } finally {
      dto.isProcess = false;
    }
  }

  protected getJob(name: string, dto: BaseJobDto): JobProcessInfoDto {
    return JobProcessInfoDto.of(
      `${this.network} ${name}`,
      dto.isProcess,
      dto.lastTime,
    );
  }
}
