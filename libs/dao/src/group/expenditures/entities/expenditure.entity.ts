import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Expenditure } from '@libs/dao/group/expenditures/interfaces/expenditure.interface';
import { AmountType } from '@libs/common/constants/expenditure.constats';

@Entity('expenditure')
@BaseTimeEntity()
@Index(['groupId', 'groupMemberId', 'expenditureAt']) // 리스트 + 정렬
@Index(['groupId', 'groupMemberId', 'amountType']) // 집계
@Index(['groupId', 'groupMemberId', 'emoji']) // 이모지 통계
export class ExpenditureEntity extends AbstractEntity implements Expenditure {
  @Column({ comment: '그룹 id' })
  groupId: number;

  @Column({ comment: '그룹 멤버 id' })
  groupMemberId: number;

  @Column({ comment: '유저 id' })
  userId: number;

  @Column({ comment: '이모지', length: 10 })
  emoji?: string;

  @Column({ comment: '+ or -' })
  amountType: AmountType;

  @Column({ comment: '금액' })
  amount: number;

  @Column({ comment: '섦명' })
  desc: string;

  @Column({ comment: '지출 시간' })
  expenditureAt: Date;
}
