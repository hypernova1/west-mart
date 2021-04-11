import User from '../models/user';
import {UserDto} from '../payload/user_dto';
import UserRepository from '../repository/user_repository';
import * as bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export default class UserService {
    async getUserById(userId: number): Promise<UserDto> {
        const user = await userRepository.findById(userId);

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        } as UserDto;
    }

    async join(userDto: UserDto): Promise<number> {
        const exUser = await userRepository.findByEmail(userDto.email);
        if (exUser) {
            return Promise.reject();
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 12);
        const newUser = await User.create({
            email: userDto.email,
            nickname: userDto.nickname,
            password: hashedPassword,
        });
        return newUser.id;
    }

    async updateUser(userDto: UserDto): Promise<boolean> {
        const isExist = await userRepository.existById(userDto.id);
        if (!isExist) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 12);
        const user = {
            nickname: userDto.nickname,
            password: hashedPassword,
        } as User;

        return await userRepository.update(user);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await userRepository.existsByEmail(email);
    }
}
