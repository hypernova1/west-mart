import { check } from 'express-validator';

const commentValidator = {
    register: [
        check('content').isEmpty().withMessage('내용은 필수입니다.'),
        check('postId').isEmpty().withMessage('게시글 번호는 필수입니다.'),
    ],
    update: [
        check('content').isEmpty().withMessage('내용은 필수입니다.'),
    ],
}

export default commentValidator;