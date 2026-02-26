//import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';

config({ path: '.development.env' });

export const dbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  dropSchema: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [],
};

export default registerAs('typeorm', () => dbConfig);
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
