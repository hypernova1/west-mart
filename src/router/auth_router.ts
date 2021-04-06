import * as express from 'express';
import * as passport from "passport";
import { isLoggedIn, isNotLoggedIn } from '../middleware';

import User from "../models/user";
import UserService from '../service/user_service';
import { UserDto } from '../payload/user_dto';

const router = express.Router();
const userService = new UserService();

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }

        return req.login(user, async (loginErr: Error) => {
            try {
                if (loginErr) {
                    return next(loginErr);
                }
                const fullUser = await userService.getUserById(user.id);
                return res.json(fullUser);
            } catch (err) {
                console.log(err);
                next(err);
            }
        });
    });
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session!.destroy(() => console.log('로그아웃 성공'));
    return res.send('로그아웃 성공');
});

router.post('/join', async (req, res, next) => {
    try {
        const userDto = req.body as UserDto;
        const userId = await userService.join(userDto);

        res.setHeader('Location', `${req.get('host')}/user/${userId}`);
        return res.status(201).send();
    } catch (error) {
        return res.status(409).send();
    }
});

export default router;