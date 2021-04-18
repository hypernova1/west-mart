import UserRepository from '../repository/user_repository';

const userRepository = new UserRepository();

export default class AdminService {

    async approveUser(userId: number) {
        const user = await userRepository.findById(userId);
        if (user.isApprove) {
            return Promise.reject();
        }

        await user.update({
            isApprove: true,
        });
    }
}