import * as bcrypt from 'bcrypt';
import UserRepository from '@repository/user_repository';
import {UserDetail, UserSummary, UserUpdateForm} from '@payload/user';
import NotFoundError from '../error/not_found_error';

const userRepository = new UserRepository();

export default class UserService {

    async getUserById(userId: number): Promise<UserDetail> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('존재하지 않는 사용자입니다.');
        }

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        } as UserDetail;
    }

    async updateUser(userId: number, updateForm: UserUpdateForm): Promise<void> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new NotFoundError('존재하지 않는 사용자입니다.');
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

    async getUserList(): Promise<Array<UserSummary>> {
        const userList = await userRepository.findAll();
        return userList.map((user) => {
            return {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            } as UserSummary;
        });
    }

    async deleteUser(id: number): Promise<void> {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new NotFoundError('존재하지 않는 사용자입니다.');
        }

        await userRepository.deleteById(id);
    }
}
