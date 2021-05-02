import UserRepository from '@repository/user_repository';
import BadRequestError from '../error/bad_request_error';

const userRepository = new UserRepository();

export default class AdminService {

    async approveUser(userId: number): Promise<void> {
        const user = await userRepository.findById(userId);
        if (user.isApprove) {
            throw new BadRequestError('이미 승인된 사용자입니다.');
        }

        await user.update({
            isApprove: true,
        });
    }
}