import { Request, Response, NextFunction } from 'express';
import Role from '@constant/role';

export const checkRole = (roles: Array<Role>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const role = res.locals.jwtPayload.role;
    if (roles.indexOf(role) > -1) {
      next();
    } else res.status(401).send();
  };
};
