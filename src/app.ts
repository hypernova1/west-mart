import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import flash from 'connect-flash';
import { join } from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { sequelize } from '../models';

import indexRouter from './router';

const app = express();
sequelize.sync();

// app.use(morgan('dev'));
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))
// app.use(flash());
app.use(indexRouter);

app.listen(3000, () => {
    console.log('server start.');
})