import { check } from 'express-validator';

const authValidator = {
    join: [
        check('email').notEmpty().withMessage('이메일은 필수입니다.').isEmail().withMessage('이메일 형식이 아닙니다.'),
        check('nickname').notEmpty().withMessage('닉네임은 필수입니다.'),
        check('password').notEmpty().withMessage('비밀번호는 필수입니다.'),
    ],
    login: [
        check('email').notEmpty().withMessage('이메일은 필수입니다.'),
        check('password').notEmpty().withMessage('비밀번호는 필수입니다.'),
    ],
}

export default authValidator;