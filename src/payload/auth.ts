import Role from '@constant/role';

export interface LoginResponse {
  userInfo: {
    id: number;
    email: string;
    nickname: string;
    role: Role;
  },
  token: string;
}