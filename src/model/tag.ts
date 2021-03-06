import { NOW } from 'sequelize';
import {
    AutoIncrement,
    Column,
    DataType,
    Model,
    Default,
    AllowNull,
    PrimaryKey,
    Table,
    CreatedAt,
    UpdatedAt,
    Unique, BelongsToMany,
} from 'sequelize-typescript';
import Post from '@model/post';
import PostTag from '@model/post_tag';

@Table({
    tableName: 'tag',
    underscored: true,
    timestamps: false
})
export default class Tag extends Model {

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

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @UpdatedAt
    updatedAt!: Date;

    @Default(NOW)
    @AllowNull(false)
    @Column(DataType.DATE)
    @CreatedAt
    readonly createdAt!: Date;

}