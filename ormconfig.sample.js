/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
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
