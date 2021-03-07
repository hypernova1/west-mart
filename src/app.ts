import express from 'express';
import bodyParser from 'body-parser';
import indexRouter from './router';

const app = express();

app.use(bodyParser.json());

app.use(indexRouter);

app.listen(3000, () => {
    console.log('server start.');
})