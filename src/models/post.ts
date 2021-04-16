import { NOW } from 'sequelize';
import {
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    DataType,
    AllowNull,
    Default,
    UpdatedAt,
    CreatedAt,
    ForeignKey, HasMany, BelongsTo, BelongsToMany
} from 'sequelize-typescript'
import User from "./user";
import Comment from './comment';
import FavoritePost from './favorite_post';

@Table({
    tableName: 'post',
    underscored: true,
    timestamps: false
})
export default class Post extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    id!: number;

    @AllowNull(false)
    @Column(DataType.CHAR)
    title!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    content!: string;

    @BelongsTo(() => User)
    writer: User;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER.UNSIGNED)
    userId: number;

    @HasMany(() => Comment)
    comments: Comment[];

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    favorite: number;

    @BelongsToMany(() => User, () => FavoritePost)
    favorites: Array<User>;

    @Default(true)
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @UpdatedAt
    updatedAt!: Date;

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @CreatedAt
    createdAt!: Date;

    increaseFavorite() {
        this.favorite++;
    }

    decreaseFavorite() {
        this.favorite--;
    }
}