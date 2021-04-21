import CategoryRepository from '../repository/category_repository';
import { CategoryDto } from '../payload/category';

const categoryRepository = new CategoryRepository();

export default class CategoryService {

    async getCategories(): Promise<Array<CategoryDto>> {
        const categories = await categoryRepository.findAll();

        return categories.map((category) => {
            return {
                id: category.id,
                sequence: category.sequence,
                name: category.name,
                managerId: category.manager.id,
            } as CategoryDto;
        });
    }
}