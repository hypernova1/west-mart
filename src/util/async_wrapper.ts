import { NextFunction, Request, Response } from 'express';

export default function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction): void {
    fn(req, res, next).catch(next);
  };
}
