export interface UserDto {
    id: number;
    email: string,
    nickname: string,
    password: string,
}

export interface LoginDto {
    email: string,
    password: string,
}