import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('contract-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.CONTRACT_DB_HOST,
  port: Number(process.env.CONTRACT_DB_PORT),
  username: process.env.CONTRACT_DB_USER_NAME,
  password: process.env.CONTRACT_DB_USER_PW,
  name: process.env.CONTRACT_DB_NAME,
  database: process.env.CONTRACT_DB_DATABASE,
  synchronize:
    process.env.CONTRACT_DB_SYNCHRONIZE &&
    JSON.parse(process.env.CONTRACT_DB_SYNCHRONIZE),
  entities: ['dist/libs/dao/src/contract/**/*.entity.!(js.map){,+(ts,js)}'],
  // logging: ['query']
}));
