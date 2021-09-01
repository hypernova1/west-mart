import * as express from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import validate from '@validate/index';
import userValidator from '@validate/user';
import UserService from '@service/user_service';
import Role from '@constant/role';
import { UserJoinForm } from '@payload/user';
import { Container } from 'typedi';
import HttpStatus from '@constant/http_status';
import wrapAsync from '@util/async_wrapper';
import { Request, Response } from 'express';

const router = express.Router();
const userService = Container.get(UserService);

router.get('/', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
  try {
    const userList = await userService.getUserList();
    return res.status(200).json(userList);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(Number(req.params.id));
    return res.status(HttpStatus.OK).json(user);
  })
);

router.put(
  '/:id',
  checkJwt,
  checkRole([Role.USER]),
  validate(userValidator['update']),
  wrapAsync(async (req: Request, res: Response) => {
    const userDto = req.body as UserJoinForm;
    const userId = req.user.id;

    await userService.updateUser(userId, userDto);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.get(
  '/email/:email',
  wrapAsync(async (req: Request, res: Response) => {
    const email = req.params.email;
    const isExistUser = await userService.existsByEmail(email);
    if (!isExistUser) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }
    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.delete(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const userId = +req.params.id;

    if (user.role === Role.USER && user.id !== userId) {
      return res.status(403).send();
    }

    await userService.deleteUser(userId);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

export default router;
