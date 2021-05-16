import Tag from '@model/tag';
import TagRepository from '@repository/tag_repository';
import {Service} from 'typedi';

@Service()
export default class TagService {

    constructor(private tagRepository: TagRepository) {}


    async getOrCreate(name: string) {
        let tag = await this.tagRepository.findByName(name);

        if (!tag) {
            tag = await this.tagRepository.save({ name: name } as Tag);
        }

        return tag.id;
    }

    async getListOrCreate(tagNames: Array<string>): Promise<Array<Tag>> {
        const tags = await this.tagRepository.findAllByNameIn(tagNames);

        const names = tags.map((tag) => {
            return tag.name;
        });

        const unregisterTags = tagNames.filter((name) => !names.includes(name))
            .map((tagName) => {
                return {
                    name: tagName,
                } as Tag;
            });

        if (unregisterTags.length > 0) {
            const newTags = await this.tagRepository.saveAll(unregisterTags);
            tags.concat(newTags)
        }

        return tags;
    }

}
