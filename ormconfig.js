/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  type: process.env.TYPE_ORM_TYPE ? process.env.TYPE_ORM_TYPE : 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || process.env.TYPE_ORM_DATABASE,
  synchronize: process.env.TYPE_ORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPE_ORM_LOGGING === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
