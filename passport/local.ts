import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from "passport-local";
import User from '../src/models/user';

export default () => {
    passport.use('local', new Strategy({
        usernameField: 'userId',
        passwordField: 'password',
    }, async (userId: string, password: string, done) => {
        try {
            const user = await User.findOne({ where: { userId } });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }
            const isCompare = await bcrypt.compare(password, user.password);
            if (!isCompare) {
                return done(null, false, { message: '비밀번호가 틀립니다.' });
            }
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));
}