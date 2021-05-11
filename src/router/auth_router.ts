import * as express from 'express';

import AuthService from '@service/auth_service';
import { UserJoinForm } from '@payload/user';
import validate from '@validate/index';
import authValidator from '@validate/auth';
import errorHandler from '@util/error_handler';
import { Container } from 'typedi';

const router = express.Router();
const authService = Container.get(AuthService);

router.post('/login', validate(authValidator['login']), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);

        return res.send({ token: token });
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.post('/join', validate(authValidator['join']), async (req, res, next) => {
    try {
        const joinForm = req.body as UserJoinForm;

        const userId = await authService.join(joinForm);

        res.setHeader('Location', `${req.get('host')}/user/${userId}`);
        res.status(201).send();
    } catch (err) {
        return errorHandler(res, err);
    }
});

export default router;