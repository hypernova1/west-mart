import * as jwt from 'jsonwebtoken';
import sequelize from '@model/index';
import { NextFunction, Request, Response } from 'express';
import User from '@model/user';
import errorHandler from '@util/error_handler';
import UnauthorizedError from '@error/unauthorized_error';

const userRepository = sequelize.getRepository(User);

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = <string>req.headers['authorization'];

  if (!token || token.split(' ').length !== 2) {
    next(new UnauthorizedError('토큰이 존재하지 않거나 올바른 형식이 아닙니다.'));
  }

  let jwtPayload;
  try {
    jwtPayload = <any>jwt.verify(token.split(' ')[1], 'secret');
    res.locals.jwtPayload = jwtPayload;
  } catch (err) {
    next(new UnauthorizedError('토큰 검증이 실패했습니다.'));
  }

  const { id, email, nickname, role } = jwtPayload;
  const newToken = jwt.sign({ id, email, nickname, role }, 'secret', {
    expiresIn: '1h',
  });

  req.user = await userRepository.findOne({
    where: {
      email: email,
    },
  });

  res.setHeader('token', newToken);

  next();
};
