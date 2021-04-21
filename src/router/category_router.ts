import { Router } from 'express';
import CategoryService from '../service/category_service';

const router = Router();
const categoryService = new CategoryService()

router.get('/', async (req, res, next) => {
    const categories = await categoryService.getCategories();

    return res.status(200).json(categories);
});

export default router;