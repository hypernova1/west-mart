import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Post from '@model/post';
import Tag from '@model/tag';

@Table({
  tableName: 'post_tag',
  underscored: true,
  timestamps: false,
})
export default class PostTag extends Model {
  @ForeignKey(() => Post)
  @Column
  postId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;
}
