import {
  AutoIncrement,
  Column,
  DataType,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import Post from '@model/post';
import PostTag from '@model/post_tag';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'tag',
})
export default class Tag extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.CHAR)
  name!: string;

  @BelongsToMany(() => Post, () => PostTag)
  posts: Array<Post>;
}
