import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Post from '@model/post';
import User from '@model/user';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'comment',

})
export default class Comment extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  readonly id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @BelongsTo(() => User, 'userId')
  writer: User;

  @BelongsTo(() => Post, 'postId')
  post: Post;

}
