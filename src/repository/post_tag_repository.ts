import PostTag from '@model/post_tag';
import { Service } from 'typedi';

@Service()
export default class PostTagRepository {

    saveAll(postTags: Array<PostTag>) {
        PostTag.bulkCreate(postTags)
            .catch((err: Error) => {
                console.log(err);
                return Promise.reject();
            });
    }

    deleteAll(postId: number) {
        PostTag.destroy({
            where: {
                postId: postId,
            }
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

}