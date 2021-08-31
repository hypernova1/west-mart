import {
  AllowNull,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';
import { NOW } from 'sequelize';

export default class BaseModel extends Model {
  @Default(NOW)
  @AllowNull(false)
  @UpdatedAt
  @Comment('업데이트 일시')
  @Column(DataType.DATE)
  updatedAt!: Date;

  @Default(NOW)
  @AllowNull(false)
  @CreatedAt
  @Comment('생성 일시')
  @Column(DataType.DATE)
  createdAt!: Date;

  @DeletedAt
  @Comment('삭제 일시')
  @Column(DataType.DATE)
  deletedAt!: Date;
}
