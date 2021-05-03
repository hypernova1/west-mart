import { NOW } from 'sequelize';
import {
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  Column,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt, HasMany, Table, BelongsToMany, Unique
} from 'sequelize-typescript';
import Post from '@model/post';
import Comment from '@model/comment';
import FavoritePost from '@model/favorite_post';
import Role from '@constant/role';

@Table({
  tableName: 'user',
  underscored: true,
  timestamps: false
})
export default class User extends Model {

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

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Post, () => FavoritePost)
  favoritePost: Array<Post>;

  @AllowNull(false)
  @Column(DataType.CHAR)
  role: Role;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isApprove: boolean;

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @CreatedAt
  readonly createdAt!: Date;

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @UpdatedAt
  updatedAt: Date;

}
