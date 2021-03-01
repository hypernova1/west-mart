import express, { Request, Response, NextFunction } from 'express';
import { getUserList } from "../dbConnection";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const userList = getUserList()
        .then((rows) => res.json(rows))
        .catch((err) => console.log(err));
    console.log(userList);
});

export = router;