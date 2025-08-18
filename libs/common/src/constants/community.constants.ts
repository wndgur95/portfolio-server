export const BugType = {
  None: 0,
  UI: 1,
  Operation: 2,
} as const;
export type BugType = (typeof BugType)[keyof typeof BugType];

export const BugStatus = {
  None: 0,
  Waiting: 1,
  Register: 2,
  Answer: 3,
} as const;
export type BugStatus = (typeof BugStatus)[keyof typeof BugStatus];

export const BugCommenter = {
  None: 0,
  Questioner: 1,
  Answer: 2,
} as const;
export type BugCommenter = (typeof BugCommenter)[keyof typeof BugCommenter];
