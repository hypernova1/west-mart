import CategoryRepository from '@repository/category_repository';
import UserRepository from '@repository/user_repository';
import Category from '@model/category';
import BadRequestError from '../error/bad_request_error';
import { CategoryDto, CategoryForm } from '@payload/category';

export default class CategoryService {

    private categoryRepository: CategoryRepository;
    private userRepository: UserRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
        this.userRepository = new UserRepository();
    }


    async getCategories(): Promise<Array<CategoryDto>> {
        const categories = await this.categoryRepository.findAll();

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
        const user = await this.userRepository.findById(categoryForm.managerId);

        if (!user) {
            throw new BadRequestError('존재하지 않는 사용자입니다.');
        }

        const lastSequence = await this.categoryRepository.getLastSequence();

        const category = {
            name: categoryForm.name,
            managerId: user.id,
            sequence: lastSequence + 1,
        } as Category;

        return await this.categoryRepository.save(category);
    }

    async updateCategory(id: number, categoryForm: CategoryForm) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new BadRequestError('존재하지 않는 카테고리입니다.');
        }

        const user = this.userRepository.findById(categoryForm.managerId);
        if (!user) {
            throw new BadRequestError('존재하지 않는 사용자입니다.');
        }

        await category.update({
            name: categoryForm.name,
            manager: user,
        });
    }

    async deleteCategory(id: number) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new BadRequestError('존재하지 않는 카테고리입니다.');
        }

        await category.update({
            isActive: false,
        })
    }
}