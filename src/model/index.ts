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

const { host, database, username, password } = config[env];

console.log('env:', env);
console.log('host:', host);
console.log('username:', username);

const sequelize = new Sequelize( {
    host: host,
    database: database,
    dialectOptions: { decimalNumbers: true },
    username: username,
    password: password,
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