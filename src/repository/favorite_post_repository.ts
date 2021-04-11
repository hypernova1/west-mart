import FavoritePost from '../models/favorite_post';

export default class FavoritePostRepository {

    async getByUserIdAndPostId(userId: number, postId: number): Promise<FavoritePost | null> {
        return FavoritePost.findOne({
            where: {
                userId: userId,
                postId: postId,
            }
        }).then((favoritePost) => {
            return favoritePost;
        })
    }

}