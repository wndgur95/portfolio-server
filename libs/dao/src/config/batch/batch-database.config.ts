import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('batch-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.BATCH_DB_HOST,
  port: Number(process.env.BATCH_DB_PORT),
  username: process.env.BATCH_DB_USER_NAME,
  password: process.env.BATCH_DB_USER_PW,
  name: process.env.BATCH_DB_NAME,
  database: process.env.BATCH_DB_DATABASE,
  synchronize:
    process.env.BATCH_DB_SYNCHRONIZE &&
    JSON.parse(process.env.BATCH_DB_SYNCHRONIZE),
  entities: ['dist/libs/dao/src/batch/**/*.entity.!(js.map){,+(ts,js)}'],
  // logging: ['query']
}));
