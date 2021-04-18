import { Router } from 'express';
import AdminService from '../service/admin_service';
import {checkJwt} from '../middleware/jwt';
import {checkRole} from '../middleware/check-role';

const router = Router();
const adminService = new AdminService();

router.patch('/user/:userId/approve', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {

    try {
        const userId = +req.params.userId;

        await adminService.approveUser(userId);

        return res.status(200).send();
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }

});

export default router;