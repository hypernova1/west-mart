import Tag from '../models/tag';

export default class TagRepository {

    findByName(name: string) {
        return Tag.findOne({
            where: {
                name: name,
            }
        }).then((tag) => {
            return tag;
        });
    }

    save(tag: Tag) {
        return Tag.create(tag)
        .then((tag) => {
            return tag;
        });
    }

}