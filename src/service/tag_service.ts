import { Service } from 'typedi';
import { Repository } from 'sequelize-typescript';

import sequelize from '@model/index';
import Tag from '@model/tag';

@Service()
export default class TagService {

    constructor(private tagRepository: Repository<Tag>) {
        this.tagRepository = sequelize.getRepository(Tag);
    }


    async getOrCreate(name: string) {
        let tag = await this.tagRepository.findOne({ where: { name: name } });

        if (!tag) {
            tag = await this.tagRepository.create({ name: name } as Tag);
        }

        return tag.id;
    }

    async getListOrCreate(tagNames: Array<string>): Promise<Array<Tag>> {
        let tags = await this.tagRepository.findAll({ where: { name: tagNames } });

        const names = tags.map((tag) => {
            return tag.name;
        });

        const filteredTags = tagNames.filter((name) => !names.includes(name))
            .map((tagName) => {
                return {
                    name: tagName,
                } as Tag;
            });

        if (filteredTags.length > 0) {
            const newTags = await this.tagRepository.bulkCreate(filteredTags);
            tags = tags.concat(newTags);
        }

        return tags;
    }

}
