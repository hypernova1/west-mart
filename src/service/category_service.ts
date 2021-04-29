import ResponseEntity from '@payload/response_entity';
import HttpStatus from '@constant/http_status';
import CategoryRepository from '@repository/category_repository';
import UserRepository from '@repository/user_repository';
import Category from '@model/category';
import { CategoryDto, CategoryForm } from '@payload/category';

const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();

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

    async registerCategory(categoryForm: CategoryForm): Promise<number> {
        const user = await userRepository.findById(categoryForm.managerId);

        if (!user) {
            return Promise.reject(
                ResponseEntity.create(HttpStatus.BAD_REQUEST, '존재하지 않는 사용자입니다.')
            );
        }

        const category = {
            name: categoryForm.name,
            manager: user,
        } as Category;

        return await categoryRepository.save(category);

    }

    async updateCategory(id: number, categoryForm: CategoryForm) {
        const category = await categoryRepository.findById(id);
        if (!category) {
            return Promise.reject(
                ResponseEntity.create(HttpStatus.NOT_FOUND, '존재하지 않는 카테고리입니다.')
            );
        }

        const user = userRepository.findById(categoryForm.managerId);
        if (!user) {
            return Promise.reject(
                ResponseEntity.create(HttpStatus.BAD_REQUEST, '존재하지 않는 사용자입니다.')
            );
        }

        await category.update({
            name: categoryForm.name,
            manager: user,
        });
    }

    async deleteCategory(id: number) {
        const category = await categoryRepository.findById(id);
        if (!category) {
            return Promise.reject(
                ResponseEntity.create(HttpStatus.NOT_FOUND, '존재하지 않는 카테고리입니다.')
            );
        }

        await category.update({
            isActive: false,
        })
    }
}