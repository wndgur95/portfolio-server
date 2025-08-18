export const DateType = {
  None: 0,
  Year: 1,
  Month: 2,
  Week: 3,
  Day: 4,
  Calendar: 5,
};
export type DateType = (typeof DateType)[keyof typeof DateType];

export const AmountType = {
  None: 0,
  Add: 1,
  Sub: 2,
};
export type AmountType = (typeof AmountType)[keyof typeof AmountType];
