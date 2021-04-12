import User from "../models/user";

export default class UserRepository {

    save(user: User): Promise<number> {
        return User.create(user)
            .then((user) => {
                return user.id;
            })
    }

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

    update(user: User): Promise<boolean> {
        return User.update(user, {
            where: {
                id: user.id
            }
        }).then(() => {
            return true;
        }).catch((err: Error) => {
            console.log(err);
            return false;
        })
    }

    existsByEmail(email: string): Promise<boolean> {
        return User.findOne({
            where: {
                email: email,
            }
        }).then((user) => {
            return !!user;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    async existById(id: number) {
        return User.findOne({
            where: {
                id: id,
            }
        }).then((user) => {
            return !!user;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}