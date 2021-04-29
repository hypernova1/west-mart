import { NOW } from 'sequelize';
import {
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    Model,
    Default,
    AllowNull,
    PrimaryKey,
    Table,
    CreatedAt,
    UpdatedAt,
    Unique,
} from 'sequelize-typescript';
import Post from '@model/post';

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

    @ForeignKey(() => Post)
    @Column(DataType.INTEGER.UNSIGNED)
    postId: number;

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