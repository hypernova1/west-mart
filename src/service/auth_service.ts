import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import User from '@model/user';
import UserRepository from '@repository/user_repository';
import BadRequestError from '../error/bad_request_error';
import ConflictError from '../error/confict_error';
import { UserJoinForm } from '@payload/user';

const userRepository = new UserRepository();

export default class AuthService {

    async login(email: string, password: string): Promise<string> {
        const user: User = await userRepository.findByEmail(email);

        if (!user) {
            throw new BadRequestError('잘못된 정보입니다.');
        }

        const isEqual = bcrypt.compareSync(password, user.password);

        if (!isEqual) {
            throw new BadRequestError('잘못된 정보입니다.');
        }

        return jwt.sign({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            role: user.role,
        }, 'secret', {
            expiresIn: '1h',
        });
    }

    async join(joinForm: UserJoinForm): Promise<number> {
        const hashedPassword: string = bcrypt.hashSync(joinForm.password, 8);
        const user = {
            email: joinForm.email,
            password: hashedPassword,
            nickname: joinForm.nickname,
            role: 'USER',
        } as User;

        try {
            return await userRepository.save(user);
        } catch (err) {
            throw new ConflictError('이미 존재하는 이메일 입니다.');
        }
    }
}