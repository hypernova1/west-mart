import User from '../models/user';

declare global {
    namespace Express {
        export interface User {}
    }
}