import { NOW } from 'sequelize';
import {
    AllowNull,
    AutoIncrement, BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default, ForeignKey, HasMany,
    Model,
    PrimaryKey, Table, Unique,
    UpdatedAt
} from 'sequelize-typescript';
import User from '@model/user';
import Post from '@model/post';

@Table({
    tableName: 'category',
    underscored: true,
    timestamps: false
})
export default class Category extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    readonly id!: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.CHAR)
    name!: string;

    @BelongsTo(() => User)
    manager!: User;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER.UNSIGNED)
    userId: number;

    @HasMany(() => Post)
    posts: Array<Post>;

    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    sequence!: number;

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
    updatedAt!: Date;

}