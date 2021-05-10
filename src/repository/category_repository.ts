import Category from '@model/category';
import User from '@model/user';

export default class CategoryRepository {

    findById(id: number): Promise<Category> {
        return Category.findOne({
            where: {
                id: id,
                isActive: true,
            },
        }).then((category) => {
            return category;
        })
    }

    findAll(): Promise<Array<Category>> {
        return Category.findAll({
            where: {
                isActive: true,
            },
            order: [
                ['sequence', 'ASC']
            ],
            include: [
                {
                    model: User,
                    as: 'manager',
                }
            ]
        }).then((categories) => {
            return categories;
        });
    }

    delete(id: number): Promise<void> {
        return Category.update({
            isActive: false,
        }, {
            where: {
                id: id,
            }
        }).then(() => {
            return Promise.resolve();
        });
    }

    save(category: Category): Promise<number> {
        return Category.create(category)
            .then((category) => {
                return Promise.resolve(category.id);
            }).catch((err) => {
                console.log(err);
                return Promise.reject();
            });
    }

    async getLastSequence(): Promise<number> {
        return Category.findOne({
            order: [
                ['sequence', 'DESC'],
            ],
            limit: 1,
        }).then((category) => {
            if (!category) return 0;
            return category.sequence;
        })
    }
}