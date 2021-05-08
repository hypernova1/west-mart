import UserRepository from '@repository/user_repository';
import BadRequestError from '../error/bad_request_error';

export default class AdminService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async approveUser(userId: number): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (user.isApprove) {
            throw new BadRequestError('이미 승인된 사용자입니다.');
        }

        await user.update({
            isApprove: true,
        });
    }
}