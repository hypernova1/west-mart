import * as bcrypt from 'bcryptjs';
import UserRepository from '@repository/user_repository';
import {UserDetail, UserSummary, UserUpdateForm} from '@payload/user';
import NotFoundError from '../error/not_found_error';

export default class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUserById(userId: number): Promise<UserDetail> {
        const user = await this.userRepository.findByIdAndIsActiveTrue(userId);
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
        const user = await this.userRepository.findByIdAndIsActiveTrueAndIsApproveTrue(userId);
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
        return await this.userRepository.existsByEmail(email);
    }

    async getUserList(): Promise<Array<UserSummary>> {
        const userList = await this.userRepository.findAll();
        return userList.map((user) => {
            return {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            } as UserSummary;
        });
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findByIdAndIsActiveTrue(id);
        if (!user) {
            throw new NotFoundError('존재하지 않는 사용자입니다.');
        }

        await this.userRepository.deleteById(id);
    }
}
