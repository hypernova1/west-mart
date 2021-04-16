import { UserSummary } from '../../src/payload/user';

declare global {
    namespace Express {
        interface Request {
            user?: UserSummary;
        }
    }
}