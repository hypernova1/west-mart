import FavoritePost from '@model/favorite_post';
import {Service} from 'typedi';

@Service()
export default class FavoritePostRepository {

    findByUserIdAndPostId(userId: number, postId: number): Promise<FavoritePost | null> {
        return FavoritePost.findOne({
            where: {
                userId: userId,
                postId: postId,
            }
        }).then((favoritePost) => {
            return Promise.resolve(favoritePost);
        });
    }

    delete(favoritePost: FavoritePost): Promise<void> {
        return FavoritePost.destroy({
            where: {
                userId: favoritePost.userId,
                postId: favoritePost.postId,
            }
        }).then(() => {
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        })
    }

    save(userId: number, postId: number) {
        return FavoritePost.create({
            userId: userId,
            postId: postId,
        }).then((favoritePost) => {
            return favoritePost;
        })
    }
}