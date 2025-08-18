import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('user-database', () => ({
  200: {
    ...baseDatabaseConfig(),
    host: process.env.USER00_DB_HOST,
    port: Number(process.env.USER00_DB_PORT),
    username: process.env.USER00_DB_USER_NAME,
    password: process.env.USER00_DB_USER_PW,
    name: process.env.USER00_DB_NAME,
    database: process.env.USER00_DB_DATABASE,
    synchronize:
      process.env.USER00_DB_SYNCHRONIZE &&
      JSON.parse(process.env.USER00_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/user/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  201: {
    ...baseDatabaseConfig(),
    host: process.env.USER01_DB_HOST,
    port: Number(process.env.USER01_DB_PORT),
    username: process.env.USER01_DB_USER_NAME,
    password: process.env.USER01_DB_USER_PW,
    name: process.env.USER01_DB_NAME,
    database: process.env.USER01_DB_DATABASE,
    synchronize:
      process.env.USER01_DB_SYNCHRONIZE &&
      JSON.parse(process.env.USER01_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/user/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  // 202: {
  //   ...baseDatabaseConfig(),
  //   host: process.env.USER02_DB_HOST,
  //   port: Number(process.env.USER02_DB_PORT),
  //   username: process.env.USER02_DB_USER_NAME,
  //   password: process.env.USER02_DB_USER_PW,
  //   name: process.env.USER02_DB_NAME,
  //   database: process.env.USER02_DB_DATABASE,
  //   synchronize:
  //     process.env.USER02_DB_SYNCHRONIZE &&
  //     JSON.parse(process.env.USER02_DB_SYNCHRONIZE),
  //   entities: ['dist/libs/dao/src/user/**/*.entity.!(js.map){,+(ts,js)}'],
  // },
}));
