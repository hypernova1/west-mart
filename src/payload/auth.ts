import { UserSummary } from '@payload/user';
import Role from '@constant/role';

export interface LoginResponse {
  userInfo: UserSummary;
  token: string;
}

export interface Jwt {
  id: string;
  email: string;
  nickname: string;
  role: Role;
  iat: number;
  exp: number;
}