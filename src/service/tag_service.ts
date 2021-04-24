import Tag from '../models/tag';
import TagRepository from '../repository/tag_repository';

const tagRepository = new TagRepository();

export default class TagService {
    
    async getOrCreate(name: string) {
        let tag = await tagRepository.findByName(name);

        if (!tag) {
            tag = {
                name: name,
            } as Tag;
            tagRepository.save(tag);
        }

        return tag.id;
    }

}