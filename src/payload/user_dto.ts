export interface UserDetail {
    id: number;
    email: string,
    nickname: string,
}

export interface UserJoinForm {
    email: string,
    nickname: string,
    password: string,
}

export interface UserUpdateForm {
    email: string,
    nickname: string,
    password: string,
}

export interface LoginDto {
    email: string,
    password: string,
}