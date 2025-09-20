import { LoggerService } from '@nestjs/common';
import { format, transports } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';
import { EnvProvider } from '@libs/common/provider/env.provider';

export class SystemLogger {
  public logger: LoggerService;

  constructor() {
    this.init();
  }

  private init(): void {
    const { combine, label, timestamp, json } = format;

    const transportList: any[] = [
      // file log
      new winstonDailyRotateFile({
        filename: `${process.env.HOSTNAME ?? 'local'}-error.log`,
        dirname: 'logs/internal',
        level: 'error',
        handleExceptions: true,
        format: combine(label({ label: 'error' }), timestamp(), json()),
        maxFiles: '7d',
        maxSize: '100m',
      }),
    ];

    transportList.push(
      new transports.Console({
        level: 'info',
        format: combine(
          timestamp(),
          utilities.format.nestLike(undefined, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    );

    this.logger = WinstonModule.createLogger({
      transports: transportList,
    });
  }
}
