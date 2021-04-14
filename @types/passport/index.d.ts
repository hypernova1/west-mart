import { UserSummary } from '../../src/payload/user';

declare global {
    namespace Express {
        export interface User extends UserSummary {}
    }
}