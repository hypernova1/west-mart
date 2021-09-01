import * as express from 'express';

import AuthService from '@service/auth_service';
import { UserJoinForm, UserSummary } from '@payload/user';
import validate from '@validate/index';
import authValidator from '@validate/auth';
import { Container } from 'typedi';
import HttpStatus from '@constant/http_status';
import { checkRole } from '@middleware/check-role';
import Role from '@constant/role';
import { checkJwt } from '@middleware/jwt';
import asyncWrapper from '@util/async_wrapper';
import { Request, Response } from 'express';

const router = express.Router();
const authService = Container.get(AuthService);

router.post(
  '/login',
  validate(authValidator['login']),
  asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    return res.status(HttpStatus.OK).send(response);
  })
);

router.post(
  '/join',
  validate(authValidator['join']),
  asyncWrapper(async (req: Request, res: Response) => {
    const joinForm = req.body as UserJoinForm;

    const userId = await authService.join(joinForm);

    res.setHeader('Location', `${req.get('host')}/user/${userId}`);
    res.status(HttpStatus.CREATED).send();
  })
);

router.post(
  '/verify',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  asyncWrapper(async (req: Request, res: Response) => {
    const user = req.user;

    const userInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
    } as UserSummary;

    return res.status(HttpStatus.OK).send(userInfo);
  })
);

export default router;
