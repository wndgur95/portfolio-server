import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('group-database', () => ({
  100: {
    ...baseDatabaseConfig(),
    host: process.env.GROUP00_DB_HOST,
    port: Number(process.env.GROUP00_DB_PORT),
    username: process.env.GROUP00_DB_USER_NAME,
    password: process.env.GROUP00_DB_USER_PW,
    name: process.env.GROUP00_DB_NAME,
    database: process.env.GROUP00_DB_DATABASE,
    synchronize:
      process.env.GROUP00_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GROUP00_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/group/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  101: {
    ...baseDatabaseConfig(),
    host: process.env.GROUP01_DB_HOST,
    port: Number(process.env.GROUP01_DB_PORT),
    username: process.env.GROUP01_DB_USER_NAME,
    password: process.env.GROUP01_DB_USER_PW,
    name: process.env.GROUP01_DB_NAME,
    database: process.env.GROUP01_DB_DATABASE,
    synchronize:
      process.env.GROUP01_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GROUP01_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/group/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  // 102: {
  //   ...baseDatabaseConfig(),
  //   host: process.env.GROUP02_DB_HOST,
  //   port: Number(process.env.GROUP02_DB_PORT),
  //   username: process.env.GROUP02_DB_USER_NAME,
  //   password: process.env.GROUP02_DB_USER_PW,
  //   name: process.env.GROUP02_DB_NAME,
  //   database: process.env.GROUP02_DB_DATABASE,
  //   synchronize:
  //     process.env.GROUP02_DB_SYNCHRONIZE &&
  //     JSON.parse(process.env.GROUP02_DB_SYNCHRONIZE),
  //   entities: ['dist/libs/dao/src/group/**/*.entity.!(js.map){,+(ts,js)}'],
  // },
}));
