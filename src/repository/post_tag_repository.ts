import PostTag from '@model/post_tag';
import { Service } from 'typedi';

@Service()
export default class PostTagRepository {

    async saveAll(postTags: Array<PostTag>) {
        await PostTag.bulkCreate(postTags)
            .then(() => {
                Promise.resolve();
            }).catch((err: Error) => {
                console.log(err);
                return Promise.reject();
            });
    }

    async deleteAll(postId: number) {
        await PostTag.destroy({
            where: {
                postId: postId,
            }
        }).then(() => {
            return Promise.resolve();
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

}