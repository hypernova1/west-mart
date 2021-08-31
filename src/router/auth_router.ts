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

const router = express.Router();
const authService = Container.get(AuthService);

router.post(
  '/login',
  validate(authValidator['login']),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const response = await authService.login(email, password);

      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/join',
  validate(authValidator['join']),
  async (req, res, next) => {
    try {
      const joinForm = req.body as UserJoinForm;

      const userId = await authService.join(joinForm);

      res.setHeader('Location', `${req.get('host')}/user/${userId}`);
      res.status(HttpStatus.CREATED).send();
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/verify',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  async (req, res, next) => {
    try {
      const user = req.user;

      const userInfo = {
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
      } as UserSummary;

      return res.status(HttpStatus.OK).send(userInfo);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
