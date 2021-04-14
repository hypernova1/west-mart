import * as express from 'express';

import AuthService from '../service/auth_service';
import { UserJoinForm } from '../payload/user';

const router = express.Router();
const authService = new AuthService();

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const token = await authService.login(email, password);

        return res.send({ token: token });
    } catch (err) {
        return res.status(401).send();
    }
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session!.destroy(() => console.log('로그아웃 성공'));
    return res.send('로그아웃 성공');
});

router.post('/join', async (req, res, next) => {
    const joinForm = req.body as UserJoinForm;

    const userId = await authService.join(joinForm);

    res.setHeader('Location', `${req.get('host')}/user/${userId}`);
    res.send();
});

export default router;