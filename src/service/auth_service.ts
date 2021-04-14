import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import UserRepository from '../repository/user_repository';
import { UserJoinForm } from '../payload/user';

const userRepository = new UserRepository();

export default class AuthService {

    async login(email: string, password: string): Promise<string> {
        const user: User = await userRepository.findByEmail(email);

        if (!user) {
            return Promise.reject();
        }

        const isEqual = bcrypt.compareSync(password, user.password);

        if (!isEqual) {
            return Promise.reject();
        }

        return jwt.sign({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        }, 'secret', {
            expiresIn: '1h',
        });
    }

    async join(joinForm: UserJoinForm) {
        const hashedPassword: string = bcrypt.hashSync(joinForm.password, 8);
        const user = {
            email: joinForm.email,
            password: hashedPassword,
            nickname: joinForm.nickname,
            role: 'USER',
        } as User;

        const userId = await userRepository.save(user);
        return userId;
    }
}