import { Request, Response, NextFunction } from "express";
import * as express from 'express';


const router = express.Router();

export default router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

