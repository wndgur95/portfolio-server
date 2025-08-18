import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('wedding-database', () => ({
  ...baseDatabaseConfig(),
  host: process.env.WEDDING_DB_HOST,
  port: Number(process.env.WEDDING_DB_PORT),
  username: process.env.WEDDING_DB_USER_NAME,
  password: process.env.WEDDING_DB_USER_PW,
  name: process.env.WEDDING_DB_NAME,
  database: process.env.WEDDING_DB_DATABASE,
  synchronize:
    process.env.WEDDING_DB_SYNCHRONIZE &&
    JSON.parse(process.env.WEDDING_DB_SYNCHRONIZE),
  entities: ['dist/libs/dao/src/wedding/**/*.entity.!(js.map){,+(ts,js)}'],
}));
