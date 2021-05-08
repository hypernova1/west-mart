import Tag from '@model/tag';
import TagRepository from '@repository/tag_repository';

export default class TagService {

    private tagRepository: TagRepository;

    constructor() {
        this.tagRepository = new TagRepository();
    }


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

        const unregisterTags = tagNames.filter((name) => !names.includes(name));

        const newTags = await this.tagRepository.saveAll(unregisterTags);

        return tags.concat(newTags);
    }

}
