import { registerAs } from '@nestjs/config';
import baseDatabaseConfig, { getEntities } from '@libs/dao/config/base-database.config';

export default registerAs('saju-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.SAJU_DB_HOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.SAJU_DB_PORT || process.env.DB_PORT || 13306),
  username: process.env.SAJU_DB_USER_NAME || process.env.DB_USER_NAME || 'portfolio_server',
  password: process.env.SAJU_DB_USER_PW || process.env.DB_USER_PW || 'portfolio_server!23',
  name: 'saju',
  database: process.env.SAJU_DB_DATABASE || 'saju_db',
  synchronize:
    process.env.SAJU_DB_SYNCHRONIZE !== undefined
      ? JSON.parse(process.env.SAJU_DB_SYNCHRONIZE)
      : true,
  entities: getEntities('saju'),
}));
