import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import { NETWORK } from '@libs/common/constants/web3.constants';

@Injectable()
export class ProcessProvider {
  private isOpen = false;

  private startHour = 20;
  private endHour = 9;

  isAvailableTime(): boolean {
    if (process.env.NODE_ENV == 'prod') {
      return true;
    } else {
      const kstTime = moment().tz('Asia/Seoul');
      const dayOfWeek = kstTime.day(); // 일요일(0)부터 토요일(6)까지의 숫자로 요일을 나타냅니다.
      const hour = kstTime.hour();

      // 토요일(6) 또는 일요일(0)인지 확인하고, 시간이 20보다 크거나 9보다 작은지 확인합니다.
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
      const isStart = hour >= this.startHour;
      const isEnd = hour < this.endHour;

      return !(isWeekend || isStart || isEnd);
    }
  }
  getCurrentHour(): any {
    const kstTime = moment().tz('Asia/Seoul');
    return kstTime.hour();
  }

  getStartHour(): number {
    return this.startHour;
  }

  setStartHour(startHour: number): void {
    this.startHour = startHour;
  }

  getEndHour(): number {
    return this.endHour;
  }

  setEndHour(endHour: number): void {
    this.endHour = endHour;
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  setIsOpen(): void {
    this.isOpen = !this.isOpen;
  }

  getJobOpen(network: string): boolean {
    if (NODE_ENV == 'prod' || network == NETWORK.PORTFOLIO) {
      return true;
    } else {
      return this.isAvailableTime() || this.isOpen;
    }
  }
}
