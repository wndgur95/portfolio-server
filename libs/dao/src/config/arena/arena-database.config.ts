import { registerAs } from '@nestjs/config';
import baseDatabaseConfig, { getEntities } from '@libs/dao/config/base-database.config';

export default registerAs('arena-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.ARENA_DB_HOST,
  port: Number(process.env.ARENA_DB_PORT),
  username: process.env.ARENA_DB_USER_NAME,
  password: process.env.ARENA_DB_USER_PW,
  name: process.env.ARENA_DB_NAME,
  database: process.env.ARENA_DB_DATABASE,
  synchronize:
    process.env.ARENA_DB_SYNCHRONIZE &&
    JSON.parse(process.env.ARENA_DB_SYNCHRONIZE),
  entities: getEntities(process.env.ARENA_DB_NAME),
  // logging: ['query']
}));
