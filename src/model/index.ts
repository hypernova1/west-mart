import { Sequelize } from 'sequelize-typescript';
import config from '../../config/config';

import User from '@model/user';
import Post from '@model/post';
import Comment from "@model/comment";
import Category from '@model/category';
import FavoritePost from "@model/favorite_post";
import Tag from '@model/tag';
import PostTag from '@model/post_tag';

const env = process.env.NODE_ENV as ('production' | 'test' | 'development') || 'development';

const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, {
    dialect: "mysql",
    models: ['/src/model/*.ts'],
    repositoryMode: true,
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