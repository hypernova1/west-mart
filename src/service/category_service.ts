import { Service } from 'typedi';
import { Repository } from 'sequelize-typescript';

import sequelize from '@model/index';
import Category from '@model/category';
import BadRequestError from '@error/bad_request_error';
import { CategoryDto, CategoryForm } from '@payload/category';
import User from '@model/user';
import { PostListDto, PostListRequest, PostSummary } from '@payload/post';
import Post from '@model/post';
import { Op } from 'sequelize';

@Service()
export default class CategoryService {
  constructor(
    private categoryRepository: Repository<Category>,
    private readonly userRepository: Repository<User>,
  ) {
    this.categoryRepository = sequelize.getRepository(Category);
    this.userRepository = sequelize.getRepository(User);
  }

  async getCategories(): Promise<Array<CategoryDto>> {
    const categories = await this.categoryRepository.findAll({
      include: [{ model: this.userRepository, as: 'manager' }],
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

  async createCategory(categoryForm: CategoryForm): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: categoryForm.managerId, isApprove: true },
    });

    if (!user) {
      throw new BadRequestError('존재하지 않는 사용자입니다.');
    }

    const lastCategory = await this.categoryRepository.findOne({
      order: [['sequence', 'DESC']],
      limit: 1,
    });

    let lastSequence = 1;
    if (lastCategory) {
      lastSequence = lastCategory.sequence + 1;
    }

    const category = await this.categoryRepository.create({
      name: categoryForm.name,
      userId: user.id,
      sequence: lastSequence,
    });
    return category.id;
  }

  async updateCategory(id: number, categoryForm: CategoryForm): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    const user = this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new BadRequestError('존재하지 않는 사용자입니다.');
    }

    await category.update({
      name: categoryForm.name,
      manager: user,
    });
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      include: [{ model: this.userRepository, as: 'manager' }],
    });

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    await category.destroy();
  }

  async getPosts(categoryName: string, request: PostListRequest): Promise<PostListDto> {
    const category = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    const posts = await category.$get('posts', {
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%' + request.keyword + '%' } },
          { content: { [Op.like]: '%' + request.keyword + '%' } },
        ],
      },
      offset: request.pageNo - 1,
      limit: request.pageNo * request.size,
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: this.userRepository,
          as: 'writer',
        },
      ],
    });

    const postDtoList = posts.map((post: Post) => {
      return {
        id: post.id,
        title: post.title,
        writer: post.writer.nickname,
        regDate: post.createdAt,
      } as PostSummary;
    });

    const totalCount = await category.$count('posts', {
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%' + request.keyword + '%' } },
          { content: { [Op.like]: '%' + request.keyword + '%' } },
        ],
      },
    });

    const totalPage = totalCount / request.size;
    const isExistNextPage = totalPage > request.pageNo;

    return {
      postList: postDtoList,
      isExistNextPage: isExistNextPage,
    } as PostListDto;
  }
}
