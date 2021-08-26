import BadRequestError from '@error/bad_request_error';
import { Service } from 'typedi';
import { Repository } from 'sequelize-typescript';
import sequelize from '@model/index';
import User from '@model/user';

@Service()
export default class AdminService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = sequelize.getRepository(User);
  }

  async approveUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
    if (user.isApprove) {
      throw new BadRequestError('이미 승인된 사용자입니다.');
    }

    await user.update({ isApprove: true });
  }

  async banUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
    if (!user.isApprove) {
      throw new BadRequestError('승인 처리 되지 않은 사용자입니다.');
    }

    await user.update({ isApprove: false });
  }
}
