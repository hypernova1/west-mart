import * as express from 'express';
import * as passport from "passport";
import { checkJwt } from '../middleware/jwt';
import { isLoggedIn, isNotLoggedIn } from '../middleware';

import User from "../models/user";
import AuthService from '../service/auth_service';
import { UserJoinForm } from '../payload/user';

const router = express.Router();
const authService = new AuthService();

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    return res.send(token);
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session!.destroy(() => console.log('로그아웃 성공'));
    return res.send('로그아웃 성공');
});

router.post('/join', async (req, res, next) => {

});

export default router;