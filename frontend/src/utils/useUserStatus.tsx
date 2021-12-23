import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export type UserRole = 'admin';

export type AuthenticatedUser = {
  type: 'AUTHENTICATED';
  user: User;
  roles: UserRole[];
};

export type UserStatus =
  | {
      type: 'UNKNOWN';
    }
  | {
      type: 'UNAUTHENTICATED';
    }
  | AuthenticatedUser;

export const isAdmin = (user: AuthenticatedUser): boolean => {
  return user.roles.some((role) => role === 'admin');
};

export const useUserStatus = (): UserStatus => {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    type: 'UNKNOWN',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          user
            .getIdTokenResult()
            .then((elem) => {
              const roles = elem.claims.roles as
                | UserRole[]
                | undefined;
              setUserStatus({
                type: 'AUTHENTICATED',
                user,
                roles: roles || [],
              });
            })
            .catch(console.log);
        } else {
          setUserStatus({ type: 'UNAUTHENTICATED' });
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return userStatus;
};

export const getIdToken = async (
  user: AuthenticatedUser
): Promise<string> => {
  return await user.user.getIdToken();
};
