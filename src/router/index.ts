import { Request, Response, NextFunction } from "express";

const express = require('express');


const router = express.Router();

export default router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

