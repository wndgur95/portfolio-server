import { Domain } from '@libs/common/domain/domain';
import { AmountType } from '@libs/common/constants/expenditure.constats';

export interface Expenditure extends Domain {
  groupId: number;
  groupMemberId: number;
  userId: number;
  emoji?: string;
  amountType: AmountType;
  amount: number;
  desc: string;
  expenditureAt: Date;
}
