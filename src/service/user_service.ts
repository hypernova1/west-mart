import User from '../models/user';
import {UserDto} from '../dto/user_dto';
import UserRepository from '../repository/user_repository';
import * as bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export default class UserService {
    async getUserById(userId: number): Promise<User> {
        return await userRepository.findById(userId);
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
        const user = await userRepository.findById(userDto.id);
        if (!user) {
            return false;
        }

        return await userRepository.update(userDto);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await userRepository.existsByEmail(email);
    }
}
