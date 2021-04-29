import FavoritePost from '@model/favorite_post';

export default class FavoritePostRepository {

    getByUserIdAndPostId(userId: number, postId: number): Promise<FavoritePost | null> {
        return FavoritePost.findOne({
            where: {
                userId: userId,
                postId: postId,
            }
        }).then((favoritePost) => {
            return Promise.resolve(favoritePost);
        });
    }

    async delete(favoritePost: FavoritePost): Promise<void> {
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

    async save(userId: number, postId: number) {
        return FavoritePost.create({
            userId: userId,
            postId: postId,
        }).then((favoritePost) => {
            return favoritePost;
        })
    }
}