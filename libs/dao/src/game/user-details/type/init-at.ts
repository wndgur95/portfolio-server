import { Column } from 'typeorm';

export class InitAt {
  @Column({
    comment: '일일 초기화 시간',
    type: 'datetime',
  })
  daily: Date;

  static create(date: Date): InitAt {
    return Object.assign(new InitAt(), {
      daily: date,
    });
  }
}
