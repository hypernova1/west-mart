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
  UpdatedAt
} from 'sequelize-typescript';

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
