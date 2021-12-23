import { fetchApi } from './fetchApi';
import { AuthenticatedUser, UserRole } from './useUserStatus';

export interface AdminUserList {
  id: string;
  roles: UserRole[];
  username?: string;
}

const url = '/user';

export const getAllUsers = async (
  userStatus: AuthenticatedUser
) => {
  return await fetchApi.get<AdminUserList[]>(url, {
    userStatus,
  });
};

export const updateUser = async (
  userStatus: AuthenticatedUser,
  userData: AdminUserList
) => {
  return await fetchApi.put<AdminUserList>(url, {
    userStatus,
    body: userData,
  });
};
