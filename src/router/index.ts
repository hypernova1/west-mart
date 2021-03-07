import express from 'express';

const router = express.Router();

export default router.get('/', (req, res, next) => {
    res.send('hello');
});

