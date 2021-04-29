import { Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import { validate } from '@validate/index';
import categoryValidator from '@validate/category';
import CategoryService from '@service/category_service';
import { CategoryForm } from '@payload/category';

const router = Router();
const categoryService = new CategoryService()

router.get('/', async (req, res, next) => {
    const categories = await categoryService.getCategories();

    return res.status(200).json(categories);
});

router.post('/', checkJwt, checkRole(["ADMIN"]), validate(categoryValidator['register']), async (req, res, next) => {
    try {
        const categoryForm = req.body as CategoryForm;

        const id = await categoryService.registerCategory(categoryForm);

        res.setHeader('Location', `${req.get('host')}/category/${id}`);
        return res.status(201).send();
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }
})

router.put('/:id', checkJwt, checkRole(["ADMIN"]), validate(categoryValidator['register']), async (req, res, next) => {
    try {
        const categoryId = +req.params.id;
        const categoryForm = req.body as CategoryForm;

        await categoryService.updateCategory(categoryId, categoryForm);

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }

});

router.delete('/:id', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
    try {
        const categoryId = +req.params.id;

        await categoryService.deleteCategory(categoryId);

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }



});

export default router;