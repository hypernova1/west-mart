import { check } from 'express-validator';

const commentValidator = {
    register: [
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
        check('postId').notEmpty().withMessage('게시글 번호는 필수입니다.'),
    ],
    update: [
        check('content').notEmpty().withMessage('내용은 필수입니다.'),
    ],
}

export default commentValidator;