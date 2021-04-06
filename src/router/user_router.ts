import * as express from 'express';
import User from '../models/user';
import { isLoggedIn } from '../middleware';
import UserService from '../service/user_service';
import { UserDto } from '../payload/user_dto';

const router = express.Router();
const userService = new UserService();

router.get('/', isLoggedIn, (req, res, next) => {
    const user: User = req.user.toJSON() as User;
    delete user.password;
    return res.json(user);
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).send('존재하지 않는 회원입니다.');
        }

        return res.json(user);
    } catch (err) {
        return res.status(404).send();
    }
});

router.put('/:id', async (req, res, next) => {
    const userDto = req.body as UserDto;
    userDto.id = req.user.id;
    const result = await userService.updateUser(userDto);
    if (!result) {
        return res.status(404).send('존재하지 않는 회원입니다.');
    }
    return res.status(200).send('success');
});

router.get('/email/:email', async (req, res, next) => {
    const email: string = req.params.email as string;
    const isExistUser = await userService.existsByEmail(email);
    if (!isExistUser) {
        return res.status(404).send();
    }
    return res.status(200).send();
});

export default router;