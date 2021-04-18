import User from "../models/user";

export default class UserRepository {

    async findAll(): Promise<Array<User>> {
        return User.findAll({
            where: {
                isActive: true,
                isApprove: true,
            }
        }).then((users) => {
            return users;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    save(user: User): Promise<number> {
        return User.create(user)
            .then((user) => {
                return user.id;
            }).catch((err: Error) => {
                console.log(err);
                return Promise.reject();
            });
    }

    findById(id: number): Promise<User> {
        return User.findOne({
            where: {
                id: id,
                isActive: true,
            }
        }).then((user: User) => {
            return user;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    findByEmail(email: string): Promise<User> {
        return User.findOne({
            where: {
                email: email,
                isActive: true,
            }
        }).then((user: User) => {
            return user;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    existsByEmail(email: string): Promise<boolean> {
        return User.count({
            where: {
                email: email,
            }
        }).then((count) => {
            return !!count;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    getById(id: number): Promise<User> {
        return User.findOne({
            where: {
                id: id,
                isActive: true,
                isApprove: true,
            }
        }).then((user) => {
            return user;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    deleteById(id: number): Promise<number> {
        return User.update({
            isActive: false,
        }, {
            where: {
                id: id,
            }
        }).then((result) => {
            return result[0];
        });
    }
}