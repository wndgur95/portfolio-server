import { registerAs } from '@nestjs/config';
import baseDatabaseConfig from '@libs/dao/config/base-database.config';

export default registerAs('game-database', () => ({
  100: {
    ...baseDatabaseConfig(),
    host: process.env.GAME00_DB_HOST,
    port: Number(process.env.GAME00_DB_PORT),
    username: process.env.GAME00_DB_USER_NAME,
    password: process.env.GAME00_DB_USER_PW,
    name: process.env.GAME00_DB_NAME,
    database: process.env.GAME00_DB_DATABASE,
    synchronize:
      process.env.GAME00_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GAME00_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/game/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  101: {
    ...baseDatabaseConfig(),
    host: process.env.GAME01_DB_HOST,
    port: Number(process.env.GAME01_DB_PORT),
    username: process.env.GAME01_DB_USER_NAME,
    password: process.env.GAME01_DB_USER_PW,
    name: process.env.GAME01_DB_NAME,
    database: process.env.GAME01_DB_DATABASE,
    synchronize:
      process.env.GAME01_DB_SYNCHRONIZE &&
      JSON.parse(process.env.GAME01_DB_SYNCHRONIZE),
    entities: ['dist/libs/dao/src/game/**/*.entity.!(js.map){,+(ts,js)}'],
  },
  // 102: {
  //   ...baseDatabaseConfig(),
  //   host: process.env.GAME02_DB_HOST,
  //   port: Number(process.env.GAME02_DB_PORT),
  //   username: process.env.GAME02_DB_USER_NAME,
  //   password: process.env.GAME02_DB_USER_PW,
  //   name: process.env.GAME02_DB_NAME,
  //   database: process.env.GAME02_DB_DATABASE,
  //   synchronize:
  //     process.env.GAME02_DB_SYNCHRONIZE &&
  //     JSON.parse(process.env.GAME02_DB_SYNCHRONIZE),
  //   entities: ['dist/libs/dao/src/game/**/*.entity.!(js.map){,+(ts,js)}'],
  // },
}));
