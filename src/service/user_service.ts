import * as bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import { Repository } from 'sequelize-typescript';

import sequelize from '@model/index';
import NotFoundError from '@error/not_found_error';
import User from '@model/user';
import { UserDetail, UserSummary, UserUpdateForm } from '@payload/user';

@Service()
export default class UserService {
  constructor(private userRepository: Repository<User>) {
    this.userRepository = sequelize.getRepository(User);
  }

  async getUserById(userId: number): Promise<UserDetail> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

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
    const user = await this.userRepository.findOne({
      where: { id: userId, isApprove: true },
    });

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
    const userCount = await this.userRepository.count({
      where: { email: email },
    });
    return !!userCount;
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
    const user = await this.userRepository.findOne({
      where: { id: id, isApprove: true },
    });

    if (!user) {
      throw new NotFoundError('존재하지 않는 사용자입니다.');
    }

    await user.destroy();
  }
}
