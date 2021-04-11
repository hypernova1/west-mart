import { Sequelize } from 'sequelize-typescript';
import config from '../../config/config';

import User from './user';
import Post from './post';
import Comment from "./comment";
import FavoritePost from "./favorite_post";

const env = process.env.NODE_ENV as ('production' | 'test' | 'development') || 'development';

const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, {
    dialect: "mysql",
    models: ['/src/models/*.ts'],
});

sequelize.addModels([
    User,
    Post,
    Comment,
    FavoritePost,
])

export { sequelize }
export default sequelize;