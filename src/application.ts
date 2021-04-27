import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as hpp from 'hpp';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import { sequelize } from './models';
import 'reflect-metadata';
import setRouter from './router';

export default class Application {
    public application: express.Application;
    public prod: boolean = process.env.NODE_ENV === 'production';

    constructor() {
        dotenv.config();
        this.application = express();
        this.application.set('port', this.prod ? process.env.PORT : 3000);
    }

    setSequelize() {
        sequelize.sync({ force: true })
            .then(() => {
                console.log('database connection,');
            }).catch((err: Error) => {
            console.log(err);
        });
    }

    setMiddleware() {
        if (this.prod) {
            this.application.use(hpp());
            this.application.use(helmet());
            this.application.use(morgan('combined'));
            this.application.use(cors({
                origin: /nodebird\.com$/,
                credentials: true,
            }));
        }

        this.application.use('/', express.static('uploads'));
        this.application.use(morgan('dev'));
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: false }));
        this.application.use(cookieParser(process.env.COOKIE_SECRET));
    }

    setRouter() {
        setRouter(this.application);
    }

    start() {
        this.application.listen(this.application.get('port'), () => {
            console.log('server start.');
        });
    }

}








