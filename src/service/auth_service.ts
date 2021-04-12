import User from '../models/user';
import UserRepository from '../repository/user_repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export default class AuthService {

    async login(email: string, password: string): Promise<string> {
        const hashedPassword: string = bcrypt.hashSync(password, 8);

        const user: User = await userRepository.findByEmail(email);

        if (!user) {
            return Promise.reject();
        }

        const isEqual = bcrypt.compareSync(hashedPassword, user.password);

        if (!isEqual) {
            return Promise.reject();
        }

        return jwt.sign({
            userId: user.id,
            nickname: user.nickname,
        }, 'secret', {
            expiresIn: '1h',
        });
    }

}