import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

export const typeOrmConfig: DataSourceOptions = databaseUrl?.startsWith('postgres')
  ? {
      type: 'postgres',
      url: databaseUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*.ts'],
      synchronize: true,
      logging: false,
      ssl: { rejectUnauthorized: false },
    }
  : {
      type: 'sqlite',
      database: databaseUrl?.replace('sqlite:///', '') || 'staylux.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*.ts'],
      synchronize: true,
      logging: false,
    };
