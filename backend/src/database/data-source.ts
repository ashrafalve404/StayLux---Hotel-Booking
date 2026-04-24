import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: true,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
};
