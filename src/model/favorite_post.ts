import {
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import Post from '@model/post';
import User from '@model/user';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'favorite_post',
})
export default class FavoritePost extends BaseModel {
  @ForeignKey(() => Post)
  @Column(DataType.INTEGER.UNSIGNED)
  postId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER.UNSIGNED)
  userId: number;
}
