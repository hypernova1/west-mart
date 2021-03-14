import * as express from 'express';
import User from "../../models/user";
import { isLoggedIn, isNotLoggedIn } from '../middleware';
import passport from "passport";
import * as userService from '../service/user';
import * as bcrypt from "bcrypt";

const router = express.Router();

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
                const fullUser = await userService.getUser(user.id);
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
        const exUser = await User.findOne({
            where: {
                userId: req.body.userId
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

export default router;