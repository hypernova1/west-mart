import User from '../models/user';
import { UserDetail, UserJoinForm, UserUpdateForm } from '../payload/user_dto';
import UserRepository from '../repository/user_repository';
import * as bcrypt from 'bcrypt';

const userRepository = new UserRepository();

export default class UserService {
    async getUserById(userId: number): Promise<UserDetail> {
        const user = await userRepository.findById(userId);

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        } as UserDetail;
    }

    async join(joinForm: UserJoinForm): Promise<number> {
        const isExist = await userRepository.findByEmail(joinForm.email);

        if (isExist) {
            return Promise.reject();
        }

        const hashedPassword = await bcrypt.hash(joinForm.password, 12);
        const newUser = await User.create({
            email: joinForm.email,
            nickname: joinForm.nickname,
            password: hashedPassword,
        });

        return newUser.id;
    }

    async updateUser(userId: number, updateForm: UserUpdateForm): Promise<boolean> {
        const isExist = await userRepository.existById(userId);
        if (!isExist) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(updateForm.password, 12);
        const user = {
            nickname: updateForm.nickname,
            password: hashedPassword,
        } as User;

        return await userRepository.update(user);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await userRepository.existsByEmail(email);
    }
}
