import { NOW } from 'sequelize';
import {
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    DataType,
    AllowNull,
    Default,
    UpdatedAt,
    CreatedAt,
    HasMany, BelongsTo, BelongsToMany
} from 'sequelize-typescript'
import User from "@model/user";
import Comment from '@model/comment';
import FavoritePost from '@model/favorite_post';
import Category from '@model/category';
import Tag from '@model/tag';
import PostTag from '@model/post_tag';

@Table({
    tableName: 'post',
    underscored: true,
    timestamps: false
})
export default class Post extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    id!: number;

    @AllowNull(false)
    @Column(DataType.CHAR)
    title!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    content!: string;

    @BelongsTo(() => Category, 'categoryId')
    category: Category;

    @BelongsTo(() => User, 'userIdx')
    writer: User;

    @HasMany(() => Comment, 'postId')
    comments: Comment[];

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    favorite: number;

    @BelongsToMany(() => User, () => FavoritePost)
    favorites: Array<User>;

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    hits: number;

    @BelongsToMany(() => Tag, () => PostTag)
    tags: Array<Tag>;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @UpdatedAt
    updatedAt!: Date;

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @CreatedAt
    readonly createdAt!: Date;

}