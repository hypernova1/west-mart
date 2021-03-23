import * as express from 'express';
import passport from "passport";
import User from "../models/user";
import { UserDto } from '../dto/user_dto';
import { isLoggedIn, isNotLoggedIn } from '../middleware';
import UserService from '../service/user_service';

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
        return res.status(201).json(userId);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

export default router;