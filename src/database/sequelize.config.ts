// Note: Database configuration for NestJS and Sequelize-cli
import 'dotenv/config';
import { Options } from 'sequelize';

const dbConfig = {
  dialect: 'sqlite',
  storage: '.db/data.sqlite3',
  autoLoadModels: true,
  synchronize: true,
} as Options;

export default dbConfig;
