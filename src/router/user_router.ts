import * as express from 'express';
import UserService from '@service/user_service';
import { UserJoinForm } from '@payload/user';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';

const router = express.Router();
const userService = new UserService();

router.post('/', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
    const userList = await userService.getUserList();
    return res.status(200).json(userList);
})

router.get('/:id', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
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

router.put('/:id', checkJwt, checkRole(["USER"]), async (req, res, next) => {
    try {
        const userDto = req.body as UserJoinForm;
        const userId = req.user.id;

        await userService.updateUser(userId, userDto);

        return res.status(200).send('success');
    } catch (err) {
        return res.status(400).send('잘못된 요청입니다.');
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

router.delete('/:id', checkJwt, checkRole(["USER", "ADMIN"]), async (req, res, next) => {
    try {
        const user = req.user;
        const userId = +req.params.id;

        if (user.role === 'USER' && user.id !== userId) {
            return res.status(403).send();
        }

        await userService.deleteUser(userId);

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(400).send('존재하지 않는 유저입니다.');
    }
})

export default router;