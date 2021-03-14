import * as express from 'express';
import User from '../../models/user';
import { isLoggedIn } from '../middleware';
import * as userService from '../service/user';

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
    const user: User = req.user.toJSON() as User;
    delete user.password;
    return res.json(user);
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await userService.getUser(Number(req.params.id));
        if (!user) {
            res.status(404).send('존재하지 않는 회원입니다.');
        }
3
        const jsonUser = user.toJSON() as User;
        return res.json(jsonUser);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

export default router;