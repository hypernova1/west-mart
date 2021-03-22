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
  UpdatedAt, HasMany, Table
} from 'sequelize-typescript';
import { Post } from './post';

@Table({
  tableName: 'user',
  underscored: true,
  timestamps: false
})
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  id!: number;

  @AllowNull(false)
  @Column(DataType.CHAR)
  nickname!: string;

  @AllowNull(false)
  @Column(DataType.CHAR)
  email!: string;

  @AllowNull(false)
  @Column(DataType.CHAR)
  password!: string;

  @HasMany(() => Post)
  posts: Post[];

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @CreatedAt
  readonly createdAt!: Date;

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @UpdatedAt
  readonly updatedAt: Date;
}
