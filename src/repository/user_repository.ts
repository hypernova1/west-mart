import User from "../models/user";
import { UserDto } from '../dto/user_dto';

export default class UserRepository {

    findById(id: number): Promise<User> {
        return User.findOne({
            where: {
                id: id,
            }
        }).then((user: User) => {
            return user;
        });
    }

    findByEmail(email: string): Promise<User> {
        return User.findOne({
            where: {
                email: email,
            }
        }).then((user: User) => {
            return user;
        });
    }

    update(userDto: UserDto): Promise<boolean> {
        return User.update(userDto, {
            where: {
                id: userDto.id
            }
        }).then(() => {
            return true;
        }).catch((err: Error) => {
            console.log(err);
            return false;
        })
    }
}