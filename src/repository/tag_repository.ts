import Tag from '@model/tag';
import {Service} from 'typedi';

@Service()
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

    findAllByNameIn(tagNames: Array<string>): Promise<Array<Tag>> {
        return Tag.findAll({
            where: {
                name: tagNames,
            }
        }).then((tags) => {
            return tags;
        })
    }

    saveAll(tags: Array<Tag>): Promise<Array<Tag>> {
        return Tag.bulkCreate(tags)
            .then((tags) => {
                return tags;
            });
    }
}