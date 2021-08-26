import { Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import { validate } from '@validate/index';
import categoryValidator from '@validate/category';
import CategoryService from '@service/category_service';
import errorHandler from '@util/error_handler';
import { CategoryForm } from '@payload/category';
import Role from '@constant/role';
import HttpStatus from "@constant/http_status";
import { Container } from 'typedi';
import logger from "@config/winston";
import { PostListRequest } from '@payload/post';

const router = Router();
const categoryService = Container.get(CategoryService);

router.get('/', async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();

        return res.status(HttpStatus.OK).json(categories);
    } catch (err) {
        logger.error(err);
        return errorHandler(res, err);
    }
});

router.get('/:categoryName/post', checkJwt, checkRole([Role.USER, Role.ADMIN]), async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        const request: PostListRequest = {};
        request.pageNo = +req.query.pageNo || 1;
        request.size = +req.query.size || 10;
        request.keyword = req.query.keyword as string || '';

        const posts = await categoryService.getPosts(categoryName, request);

        return res.status(HttpStatus.OK).json(posts);
    } catch (err) {
        logger.error(err);
        return errorHandler(res, err);
    }
});

router.post('/', checkJwt, checkRole([Role.ADMIN]), validate(categoryValidator['create']), async (req, res, next) => {
    try {
        const categoryForm = req.body as CategoryForm;

        const id = await categoryService.createCategory(categoryForm);

        res.setHeader('Location', `${req.get('host')}/category/${id}`);
        return res.status(HttpStatus.CREATED).send();
    } catch (err) {
        logger.error(err);
        return errorHandler(res, err);
    }
})

router.put('/:id', checkJwt, checkRole([Role.ADMIN]), validate(categoryValidator['create']), async (req, res, next) => {
    try {
        const categoryId = +req.params.id;
        const categoryForm = req.body as CategoryForm;

        await categoryService.updateCategory(categoryId, categoryForm);

        return res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
        logger.error(err);
        return errorHandler(res, err);
    }

});

router.delete('/:id', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    try {
        const categoryId = +req.params.id;

        await categoryService.deleteCategory(categoryId);

        return res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
        logger.error(err);
        errorHandler(res, err);
    }
});

export default router;