import { check } from 'express-validator';

const postValidator = {
    create: [
        check('title').notEmpty().withMessage('제목은 필수입니다.'),
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
        check('categoryId').notEmpty().withMessage('카테고리 아이디는 필수입니다.'),
    ],
    update: [
        check('title').notEmpty().withMessage('제목은 필수입니다.'),
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
        check('categoryId').notEmpty().withMessage('카테고리 아이디는 필수입니다.'),
    ],
}

export default postValidator;