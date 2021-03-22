import { User } from '../src/models/user';
import local from './local';
import { PassportStatic } from 'passport';

export default (passport: PassportStatic) => {
    //로그인시 실행
    passport.serializeUser((user: User, done) => {
        done(null, user.id);
    });

    //로그아웃시 실행
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user: User = await User.findOne({
                where: { id }
            });
            if (!user) {
                return done(new Error('no user'));
            }
            return done(null, user); //req.user
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });

    local();
}