import 'source-map-support/register';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as hpp from 'hpp';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import { sequelize } from '@model/index';
import 'reflect-metadata';
import setRouter from './router';
import logger from '@config/winston';
import path = require('path');

export default class Application {
  public application: express.Application;
  public prod: boolean = process.env.NODE_ENV === 'prod';

  constructor() {
    const envPath = 'env/' + process.env.NODE_ENV + '.env';
    dotenv.config({
      path: path.join(envPath),
    });

    console.log(`load ${envPath}`);

    this.application = express();
    this.application.set('port', this.prod ? process.env.PORT : 3001);
  }

  setSequelize(): void {
    sequelize
      .sync()
      .then(() => {
        logger.info('database connection,');
      })
      .catch((err: Error) => {
        logger.error(err.stack);
      });
  }

  setMiddleware(): void {
    if (this.prod) {
      this.application.use(hpp());
      this.application.use(helmet());
      this.application.use(morgan('combined'));
    }

    this.application.use(cors({}));
    this.application.use('/', express.static('uploads'));
    this.application.use(morgan('dev'));
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: false }));
    this.application.use(cookieParser(process.env.COOKIE_SECRET));
  }

  setRouter(): void {
    setRouter(this.application);
  }

  start(): void {
    this.application.listen(this.application.get('port'), () => {
      logger.info(`server start. port: ${this.application.get('port')}`);
    });
  }
}
