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
    BelongsTo,
    ForeignKey
} from 'sequelize-typescript'
import { User } from "./user";

@Table({
    tableName: 'post',
    underscored: true,
    timestamps: false
})
export class Post extends Model {

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

    @ForeignKey(() => User)
    @Column(DataType.INTEGER.UNSIGNED)
    userId: number;

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

}