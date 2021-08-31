import {
  DataType,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  Default,
  HasMany,
  Table,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import Post from '@model/post';
import Comment from '@model/comment';
import FavoritePost from '@model/favorite_post';
import Role from '@constant/role';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'user',
})
export default class User extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  id!: number;

  @AllowNull(false)
  @Column(DataType.CHAR)
  nickname!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.CHAR)
  email!: string;

  @AllowNull(false)
  @Column(DataType.CHAR)
  password!: string;

  @HasMany(() => Post, 'userId')
  posts: Post[];

  @HasMany(() => Comment, 'userId')
  comments: Comment[];

  @BelongsToMany(() => Post, () => FavoritePost)
  favoritePost: Array<Post>;

  @AllowNull(false)
  @Column(DataType.CHAR)
  role: Role;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isApprove: boolean;

}
