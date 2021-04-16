import User from "../models/user";

export default class UserRepository {

    async findAll(): Promise<Array<User>> {
        return User.findAll({
            where: {
                isActive: true,
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

    update(user: User): Promise<boolean> {
        return User.update(user, {
            where: {
                id: user.id
            }
        }).then(() => {
            return true;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    existsByEmail(email: string): Promise<boolean> {
        return User.count({
            where: {
                email: email,
                isActive: true,
            }
        }).then((count) => {
            return !!count;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    existById(id: number) {
        return User.count({
            where: {
                id: id,
                isActive: true,
            }
        }).then((count) => {
            return !!count;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

}