import UserModel from '../../src/models/user';

declare global {
    namespace Express {
        export interface User extends UserModel {}
    }
}