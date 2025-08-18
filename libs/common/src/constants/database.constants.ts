export const DB_NAME = {
  COMMON: process.env.COMMON_DB_NAME,
  WEDDING: process.env.WEDDING_DB_NAME,
} as const;
export type DbName = (typeof DB_NAME)[keyof typeof DB_NAME];
