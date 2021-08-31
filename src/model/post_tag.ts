import {
  Column,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import Post from '@model/post';
import Tag from '@model/tag';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'post_tag',
})
export default class PostTag extends BaseModel {
  @ForeignKey(() => Post)
  @Column
  postId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;
}
