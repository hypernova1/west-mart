import * as express from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import validate from '@validate/index';
import userValidator from '@validate/user';
import UserService from '@service/user_service';
import errorHandler from '@util/error_handler';
import Role from '@constant/role';
import { UserJoinForm } from '@payload/user';
import {Container} from 'typedi';

const router = express.Router();
const userService = Container.get(UserService);

router.get('/', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    const userList = await userService.getUserList();
    return res.status(200).json(userList);
})

router.get('/:id', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        return res.json(user);
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.put('/:id', checkJwt, checkRole([Role.USER]), validate(userValidator['update']), async (req, res, next) => {
    try {
        const userDto = req.body as UserJoinForm;
        const userId = req.user.id;

        await userService.updateUser(userId, userDto);

        return res.status(200).send('success');
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.get('/email/:email', async (req, res, next) => {
    const email: string = req.params.email as string;
    const isExistUser = await userService.existsByEmail(email);
    if (!isExistUser) {
        return res.status(404).send();
    }
    return res.status(200).send();
});

router.delete('/:id', checkJwt, checkRole([Role.ADMIN, Role.USER]), async (req, res, next) => {
    try {
        const user = req.user;
        const userId = +req.params.id;

        if (user.role === Role.USER && user.id !== userId) {
            return res.status(403).send();
        }

        await userService.deleteUser(userId);

        return res.status(204).send();
    } catch (err) {
        return errorHandler(res, err);
    }
})

export default router;