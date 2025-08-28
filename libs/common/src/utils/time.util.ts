export class TimeUtil {
  static readonly CHANGE_DAY_HOURS = 20; // UTC: 20:00, KST: NEXT DAY 05:00
  static readonly SECOND = 1000;
  static readonly MINUTE = 60 * TimeUtil.SECOND;
  static readonly HOUR = 60 * TimeUtil.MINUTE;
  static readonly DAY = 24 * TimeUtil.HOUR;
  static readonly WEEK = 7;
  static readonly MONTH = 12;

  /**
   * 시스템 현재 시간
   */
  static now(): Date {
    return new Date();
  }

  /**
   * 월 차감
   */
  static subMonth(date: Date, subMonth: number): Date {
    return new Date(date.getMonth() - subMonth);
  }

  /**
   * 일 추가
   */
  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * this.DAY);
  }

  /**
   * 일 차감
   */
  static subDays(date: Date, days: number): Date {
    return new Date(date.getTime() - days * this.DAY);
  }

  /**
   * 시 추가
   */
  static addHours(date: Date, addHours: number): Date {
    return new Date(date.getTime() + addHours * this.HOUR);
  }

  /**
   * 시 차감
   */
  static subHours(date: Date, subHours: number): Date {
    return new Date(date.getTime() - subHours * this.HOUR);
  }

  /**
   * 분 추가
   */
  static addMinutes(date: Date, addMinutes: number): Date {
    return new Date(date.getTime() + addMinutes * this.MINUTE);
  }

  /**
   * 분 차감
   */
  static subMinutes(date: Date, subMinutes: number): Date {
    return new Date(date.getTime() - subMinutes * this.MINUTE);
  }

  /**
   * 초 추가
   */
  static addSeconds(date: Date, addSeconds: number): Date {
    return new Date(date.getTime() + addSeconds * this.SECOND);
  }

  /**
   * 초 차감
   */
  static subSeconds(date: Date, subSeconds: number): Date {
    return new Date(date.getTime() - subSeconds * this.SECOND);
  }

  /**
   * Date 간 시 차이
   */
  static diffHours(date1: Date, date2: Date): number {
    const diffHours = Math.abs(date1.getTime() - date2.getTime()) / this.HOUR;

    return Math.floor(diffHours);
  }

  /**
   * Date 간 분 차이
   */
  static diffMinutes(date1: Date, date2: Date): number {
    const diffMinute =
      Math.abs(date1.getTime() - date2.getTime()) / this.MINUTE;

    return Math.floor(diffMinute);
  }

  /**
   * Date 간 초 차이
   */
  static diffSecond(date1: Date, date2: Date): number {
    const diffSecond =
      Math.abs(date1.getTime() - date2.getTime()) / this.SECOND;

    return Math.floor(diffSecond);
  }

  /**
   * Date 간 일 차이
   */
  static diffDay(
    date1: Date,
    date2: Date,
    baseHour = this.CHANGE_DAY_HOURS,
  ): number {
    const date1BaseStartDateTimeStamp = this.getDayStartAt(
      date1,
      baseHour,
    ).getTime();

    const date2BaseStartDateTimeStamp = this.getDayStartAt(
      date2,
      baseHour,
    ).getTime();

    return (
      Math.abs(date1BaseStartDateTimeStamp - date2BaseStartDateTimeStamp) /
      this.DAY
    );
  }

  /**
   * Date 간 일 변경 확인
   */
  static isChangeDay(
    date1: Date,
    date2 = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): boolean {
    const date2TimeStamp = date2.getTime();

    const baseStartDateTimeStamp = this.getDayStartAt(
      date1,
      baseHour,
    ).getTime();

    const baseEndDateTimeStamp = this.getDayEndAt(date1, baseHour).getTime();

    return !(
      baseStartDateTimeStamp <= date2TimeStamp &&
      date2TimeStamp < baseEndDateTimeStamp
    );
  }

  /**
   * Date 간 주 변경 확인
   */
  static isChangeWeek(
    date1: Date,
    date2 = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): boolean {
    let date1DayOfWeek = this.dayOfWeek(date1, baseHour);

    date1DayOfWeek = date1DayOfWeek === 0 ? 7 : date1DayOfWeek;

    let date2DayOfWeek = this.dayOfWeek(date2, baseHour);

    date2DayOfWeek = date2DayOfWeek === 0 ? 7 : date2DayOfWeek;

    return (
      date2DayOfWeek - date1DayOfWeek < 0 ||
      this.diffDay(date1, date2, baseHour) > 6
    );
  }

  /**
   * Date 간 월 변경 확인
   */
  static isChangeMonth(
    date1: Date,
    date2 = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): boolean {
    return (
      this.getDayStartAt(date1, baseHour).getMonth() !==
      this.getDayStartAt(date2, baseHour).getMonth()
    );
  }

  /**
   * 요일
   */
  static dayOfWeek(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): number {
    const dayOfWeek = this.getDayEndAt(date, baseHour).getDay();

    return dayOfWeek < 0 ? 6 : dayOfWeek;
  }

  /**
   * 일 단위로 기준 시에 의한 시작 시간으로 변환
   */
  static getDayStartAt(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): Date {
    const baseStartDate = this.getBaseDate(date, baseHour);

    return baseStartDate.getTime() > date.getTime()
      ? this.subDays(baseStartDate, 1)
      : baseStartDate;
  }

  /**
   * 일 단위로 기준 시에 의한 종료 시간으로 변환
   */
  static getDayEndAt(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): Date {
    const baseStartDate = this.getDayStartAt(date, baseHour);

    return this.addDays(baseStartDate, 1);
  }

  /**
   * 주간 단위로 기준 시에 의한 시작 시간으로 변환
   */
  static getWeeklyStartAt(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): Date {
    const baseStartDate = this.getDayEndAt(date, baseHour);

    const dayOfWeek = this.dayOfWeek(date, baseHour);

    return this.subDays(baseStartDate, dayOfWeek == 0 ? 7 : dayOfWeek);
  }

  /**
   * 주간 단위로 기준 시에 의한 종료 시간으로 변환
   */
  static getWeeklyEndAt(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): Date {
    const baseEndDate = this.getDayEndAt(date, baseHour);

    const dayOfWeek = this.dayOfWeek(date, baseHour);

    const addDays = (this.WEEK - dayOfWeek) % this.WEEK;

    if (addDays === 0) {
      return baseEndDate;
    }

    return this.addDays(baseEndDate, addDays);
  }

  /**
   * 월간 단위로 기준 시에 의한 종료 시간으로 변환
   */
  static getMonthlyEndAt(
    date = this.now(),
    baseHour = this.CHANGE_DAY_HOURS,
  ): Date {
    const baseStartDate = this.getDayStartAt(date, baseHour);

    const addDay =
      this.getLastDayOfMonth(baseStartDate) - baseStartDate.getDate();

    if (addDay > 0) {
      return TimeUtil.addDays(baseStartDate, addDay);
    }

    const nextMonthIndex = (baseStartDate.getMonth() + 1) % this.MONTH;

    return TimeUtil.addDays(
      baseStartDate,
      this.getLastDayOfMonth(
        new Date(
          baseStartDate.getFullYear() + (nextMonthIndex === 1 ? 0 : 1),
          nextMonthIndex,
        ),
      ),
    );
  }

  /**
   * 날짜 가져오기
   */
  static getTodayDate(now = TimeUtil.now()): number {
    return this.getDayEndAt(now).getDate();
  }

  /**
   * 기준 시로 변환
   */
  static getBaseDate(date: Date, baseHour = this.CHANGE_DAY_HOURS): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseHour,
      0,
      0,
    );
  }

  /**
   * 달의 마지막 날짜 구하기
   */
  static getLastDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static convertToUtc(date: Date): Date {
    const convertedUtc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );

    return new Date(convertedUtc);
  }

  static convertTimestampToDate(timestamp: number): Date {
    return new Date(timestamp);
  }

  static getTodaySpecificTime(
    hour = this.CHANGE_DAY_HOURS,
    minute = 0,
    second = 0,
  ): Date {
    const now = new Date(); // 현재 날짜와 시간

    let specificTime = now;
    if (now.getHours() < hour) {
      specificTime = this.subDays(now, 1);
    }

    return new Date(
      specificTime.getFullYear(),
      specificTime.getMonth(),
      specificTime.getDate(),
      hour,
      minute,
      second,
    );
  }

  static convertToDateString(isoString: string): string {
    // ISO 8601 형식의 문자열을 JavaScript Date 객체로 변환
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
