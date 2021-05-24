import { Service } from 'typedi';
import { Repository } from "sequelize-typescript";

import sequelize from "@model/index";
import Category from '@model/category';
import BadRequestError from '@error/bad_request_error';
import { CategoryDto, CategoryForm } from '@payload/category';
import User from "@model/user";

@Service()
export default class CategoryService {

    constructor(private categoryRepository: Repository<Category>,
                private readonly userRepository: Repository<User>) {
        this.categoryRepository = sequelize.getRepository(Category);
        this.userRepository = sequelize.getRepository(User);
    }

    async getCategories(): Promise<Array<CategoryDto>> {
        const categories = await this.categoryRepository.findAll({
            include: [{
                model: this.userRepository,
                as: 'manager',
            }],
        });

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
        const user = await this.userRepository.findOne({
            where: {
                id: categoryForm.managerId,
                isActive: true,
                isApprove: true,
            }
        });

        if (!user) {
            throw new BadRequestError('존재하지 않는 사용자입니다.');
        }

        const category = await this.categoryRepository.findOne({
            order: [
                ['sequence', 'DESC'],
            ],
            limit: 1,
        });

        let lastSequence = 1;
        if (category) {
            lastSequence = category.sequence + 1;
        }

        const newCategory = {
            name: categoryForm.name,
            userId: user.id,
            sequence: lastSequence,
        } as Category;

        const createdCategory = await this.categoryRepository.create(newCategory)
        return createdCategory.id;
    }

    async updateCategory(id: number, categoryForm: CategoryForm) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: id,
                isActive: true,
            }
        });
        if (!category) {
            throw new BadRequestError('존재하지 않는 카테고리입니다.');
        }

        const user = this.userRepository.findOne({
            where: {
                id: id,
                isActive: true,
            }
        });

        if (!user) {
            throw new BadRequestError('존재하지 않는 사용자입니다.');
        }

        await category.update({
            name: categoryForm.name,
            manager: user,
        });
    }

    async deleteCategory(id: number) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: id,
                isActive: true,
            },
            include: [
                {
                    model: this.userRepository,
                    as: 'manager',
                }
            ]
        });

        if (!category) {
            throw new BadRequestError('존재하지 않는 카테고리입니다.');
        }

        await category.update({
            isActive: false,
        })
    }
}