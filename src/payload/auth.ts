import { UserSummary } from '@payload/user';

export interface LoginResponse {
  userInfo: UserSummary;
  token: string;
}
