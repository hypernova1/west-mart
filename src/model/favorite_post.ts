import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import Post from "@model/post";
import User from "@model/user";

@Table({
    tableName: 'favorite-post',
    underscored: true,
    timestamps: false
})
export default class FavoritePost extends Model {

    @ForeignKey(() => Post)
    @Column(DataType.INTEGER.UNSIGNED)
    postId: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER.UNSIGNED)
    userId: number;

}