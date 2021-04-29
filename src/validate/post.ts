import { check } from 'express-validator';

const postValidator = {
    register: [
        check('title').isEmpty().withMessage('제목은 필수입니다.'),
        check('content').isEmpty().withMessage('내용은 필수입니다.'),
        check('categoryId').isEmpty().withMessage('카테고리 아이디는 필수입니다.'),
    ],
    update: [
        check('title').isEmpty().withMessage('제목은 필수입니다.'),
        check('content').isEmpty().withMessage('내용은 필수입니다.'),
        check('categoryId').isEmpty().withMessage('카테고리 아이디는 필수입니다.'),
    ],
}

export default postValidator;