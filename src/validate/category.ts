import { check } from 'express-validator';

const categoryValidator = {
    register: [
        check('name').isEmpty().withMessage('카테고리명은 필수입니다.'),
        check('managerId').isEmpty().withMessage('카테고리 관리자의 아이디는 필수입니다.')
    ],
    update: [
        check('name').isEmpty().withMessage('카테고리명은 필수입니다.'),
        check('managerId').isEmpty().withMessage('카테고리 관리자의 아이디는 필수입니다.')
    ]
}



export default categoryValidator;