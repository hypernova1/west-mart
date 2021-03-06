import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Repository } from "sequelize-typescript";

import sequelize from "@model/index";
import User from '@model/user';
import BadRequestError from '@error/bad_request_error';
import ConflictError from '@error/confict_error';
import Role from '@constant/role';
import { UserJoinForm } from '@payload/user';

@Service()
export default class AuthService {

    constructor(private userRepository: Repository<User>) {
        this.userRepository = sequelize.getRepository(User);
    }

    async login(email: string, password: string): Promise<string> {
        const user: User = await this.userRepository.findOne({ where: { email: email, isActive: true } });

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
        try {
            const hashedPassword: string = bcrypt.hashSync(joinForm.password, 8);

            const user = await this.userRepository.create( {
                email: joinForm.email,
                password: hashedPassword,
                nickname: joinForm.nickname,
                role: Role.USER,
            });

            return user.id;
        } catch (err) {
            throw new ConflictError('이미 존재하는 이메일 입니다.');
        }
    }
}