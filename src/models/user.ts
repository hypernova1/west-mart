import * as bcrypt from "bcryptjs";
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
  UpdatedAt, HasMany, Table, BelongsToMany
} from 'sequelize-typescript';
import Post from './post';
import Comment from './comment';
import FavoritePost from './favorite_post';

@Table({
  tableName: 'user',
  underscored: true,
  timestamps: false
})
export default class User extends Model {

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

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsToMany(() => Post, () => FavoritePost)
  favoritePost: Array<Post>

  @AllowNull(false)
  @Column(DataType.CHAR)
  role: string;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

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

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

}
