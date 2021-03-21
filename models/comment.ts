import { NOW } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt
} from 'sequelize-typescript';

export class Comment extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  readonly id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

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
