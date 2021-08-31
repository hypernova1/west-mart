import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import User from '@model/user';
import Post from '@model/post';
import BaseModel from '@model/base_model';

@Table({
  tableName: 'category',
})
export default class Category extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  readonly id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.CHAR)
  name!: string;

  @BelongsTo(() => User, 'userId')
  manager!: User;

  @HasMany(() => Post, 'categoryId')
  posts: Array<Post>;

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  sequence!: number;
}
