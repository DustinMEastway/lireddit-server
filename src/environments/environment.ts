import { DataSourceOptions } from 'typeorm';

export interface Environment {
  cookieName: string;
  database: DataSourceOptions,
  port: number;
  prod: boolean;
  urls: {
    app: string;
  };
}

export const environment: Environment = {
  cookieName: 'qid',
  database: {
    database: 'lireddit',
    logging: true,
    password: 'postgres',
    type: 'postgres',
    username: 'postgres',
    synchronize: true
  },
  port: 4000,
  prod: false,
  urls: {
    app: 'http://localhost:3000'
  }
} as const;
