import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import User from '@model/user';
import UserRepository from '@repository/user_repository';
import {UserJoinForm} from '@payload/user';
import HttpStatus from '@constant/http_status';
import ResponseEntity from '@payload/response_entity';

const userRepository = new UserRepository();

export default class AuthService {

    async login(email: string, password: string): Promise<string> {
        const user: User = await userRepository.findByEmail(email);

        if (!user) {
            return Promise.reject(
                ResponseEntity.badRequest({ message: '잘못된 정보입니다.' })
            );
        }

        const isEqual = bcrypt.compareSync(password, user.password);

        if (!isEqual) {
            return Promise.reject(
                ResponseEntity.badRequest({ message: '잘못된 정보입니다.' })
            );
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
            return Promise.reject(
                ResponseEntity.conflict({ message: '이미 존재하는 이메일입니다.' })
            );
        }
    }
}