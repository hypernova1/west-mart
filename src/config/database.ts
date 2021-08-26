import * as dotenv from 'dotenv';
import path = require('path');

const env = process.env.NODE_ENV || 'prod';

dotenv.config({
  path: path.join('env/' + env + '.env'),
});

type Database = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  [key: string]: string;
};

interface IConfigGroup {
  dev: Database;
  local: Database;
  prod: Database;
}

const config: IConfigGroup = {
  dev: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  prod: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};

export default config;
