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
    Unique,
} from 'sequelize-typescript';

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

    @AllowNull(false)
    @Column(DataType.CHAR)
    @Unique
    name!: string;

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