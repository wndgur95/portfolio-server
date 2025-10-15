import { registerAs } from '@nestjs/config';
import baseDatabaseConfig, { getEntities } from '@libs/dao/config/base-database.config';

export default registerAs('common-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.COMMON_DB_HOST,
  port: Number(process.env.COMMON_DB_PORT),
  username: process.env.COMMON_DB_USER_NAME,
  password: process.env.COMMON_DB_USER_PW,
  name: process.env.COMMON_DB_NAME,
  database: process.env.COMMON_DB_DATABASE,
  synchronize:
    process.env.COMMON_DB_SYNCHRONIZE &&
    JSON.parse(process.env.COMMON_DB_SYNCHRONIZE),
  entities: getEntities(process.env.COMMON_DB_NAME),
  // logging: ['query']
}));
