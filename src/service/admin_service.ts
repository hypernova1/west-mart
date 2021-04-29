import UserRepository from '@repository/user_repository';
import ResponseEntity from '@payload/response_entity';
import HttpStatus from '@constant/http_status';

const userRepository = new UserRepository();

export default class AdminService {

    async approveUser(userId: number): Promise<void> {
        const user = await userRepository.findById(userId);
        if (user.isApprove) {
            return Promise.reject(
                ResponseEntity.create(HttpStatus.BAD_REQUEST, '이미 승인된 사용자입니다.')
            );
        }

        await user.update({
            isApprove: true,
        });
    }
}