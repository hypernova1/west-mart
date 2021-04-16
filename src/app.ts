import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as hpp from 'hpp';
import * as helmet from 'helmet';
import { sequelize } from './models';
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

setRouter(app);

app.listen(app.get('port'), () => {
    console.log('server start.');
})