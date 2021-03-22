import { NOW } from 'sequelize';
import {
  AllowNull,
  AutoIncrement, BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default, ForeignKey, HasOne,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript';
import {Post} from "./post";
import {User} from "./user";

@Table({
  tableName: 'comment',
  underscored: true,
  timestamps: false
})
export class Comment extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  readonly id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER.UNSIGNED)
  userId: number;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER.UNSIGNED)
  postId: number;

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @CreatedAt
  readonly createdAt!: Date;

  @Default(NOW)
  @AllowNull(false)
  @Column(DataType.DATE)
  @UpdatedAt
  readonly updatedAt!: Date;

}
