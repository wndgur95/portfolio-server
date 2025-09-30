export const UpdateCashType = {
  ADD: 'add',
  SUB: 'sub',
  SET: 'set',
};

export type UpdateCashType =
  (typeof UpdateCashType)[keyof typeof UpdateCashType];
