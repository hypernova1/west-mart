import { check } from 'express-validator';

const userValidator = {
    update: [
        check('email').notEmpty().withMessage('이메일은 필수입니다.'),
        check('nickname').notEmpty().withMessage('닉네임은 필수입니다.'),
        check('password').notEmpty().withMessage('닉네임은 필수입니다.'),
    ]
}

export default userValidator;