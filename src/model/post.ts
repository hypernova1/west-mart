import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
  DataType,
  AllowNull,
  Default,
  HasMany,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import User from '@model/user';
import Comment from '@model/comment';
import FavoritePost from '@model/favorite_post';
import Category from '@model/category';
import Tag from '@model/tag';
import PostTag from '@model/post_tag';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'post',
})
export default class Post extends BaseModel {
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

  @BelongsTo(() => User, 'userId')
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

}
