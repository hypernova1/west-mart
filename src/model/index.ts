import { Sequelize } from 'sequelize-typescript';
import config from '@config/database';

import User from '@model/user';
import Post from '@model/post';
import Comment from "@model/comment";
import Category from '@model/category';
import FavoritePost from "@model/favorite_post";
import Tag from '@model/tag';
import PostTag from '@model/post_tag';

const env = process.env.NODE_ENV as ('prod' | 'local' | 'dev') || 'dev';

const { database, username, password } = config[env];

const sequelize = new Sequelize( {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    dialectOptions: { decimalNumbers: true },
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    repositoryMode: true,
    models: ['/src/model/*.ts'],
    dialect: 'mysql',
    sync: {
        force: false,
    },
    port: 3306,
    ssl: true,

});

sequelize.addModels([
    User,
    Post,
    Comment,
    Category,
    FavoritePost,
    Tag,
    PostTag,
]);

export { sequelize }
export default sequelize;