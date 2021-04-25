import Tag from '../models/tag';
import TagRepository from '../repository/tag_repository';

const tagRepository = new TagRepository();

export default class TagService {
    
    async getOrCreate(name: string) {
        let tag = await tagRepository.findByName(name);

        if (!tag) {
            tag = await tagRepository.save({ name: name } as Tag);
        }

        return tag.id;
    }

    async getListOrCreate(tagNames: Array<string>): Promise<Array<Tag>> {
        const tags = await tagRepository.findAllByNameIn(tagNames);

        const names = tags.map((tag) => {
            return tag.name;
        });

        const unregisterTags = tagNames.filter((name) => !names.includes(name));

        const newTags = await tagRepository.saveAll(unregisterTags);

        return tags.concat(newTags);
    }

}