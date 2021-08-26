import { check } from 'express-validator';

const commentValidator = {
    create: [
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
    ],
    update: [
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
    ],
}

export default commentValidator;