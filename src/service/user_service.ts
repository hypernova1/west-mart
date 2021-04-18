import User from '../models/user';
import { UserDetail, UserUpdateForm } from '../payload/user';
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

    async updateUser(userId: number, updateForm: UserUpdateForm): Promise<void> {
        const user = await userRepository.getById(userId);
        if (!user) {
            return Promise.resolve();
        }

        const hashedPassword = await bcrypt.hash(updateForm.password, 12);

        await user.update({
            nickname: updateForm.nickname,
            password: hashedPassword,
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await userRepository.existsByEmail(email);
    }

    async getUserList() {
        return await userRepository.findAll();
    }

    async deleteUser(id: number) {
        const user = await userRepository.findById(id);
        if (!user.isActive) {
            return Promise.reject();
        }

        await userRepository.deleteById(id);
    }
}
