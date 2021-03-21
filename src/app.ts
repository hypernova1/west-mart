import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as passport from 'passport';
import passportConfig from '../passport';
import * as hpp from 'hpp';
import * as helmet from 'helmet';
import { sequelize } from '../models';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import setRouter from './router';

dotenv.config();

const app = express();
const prod: boolean = process.env.NODE_ENV === 'production';

app.set('port', prod ? process.env.PORT : 3000);

sequelize.sync({ force: false })
    .then(() => {
        console.log('database connection,');
    }).catch((err: Error) => {
    console.log(err);
});

if (prod) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({
        origin: /nodebird\.com$/,
        credentials: true,
    }));
}

app.use('/', express.static('uploads'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: prod ? '.west-mart.com' : undefined,
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

setRouter(app);

app.listen(app.get('port'), () => {
    console.log('server start.');
})