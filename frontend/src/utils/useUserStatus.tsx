import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

type UserRole = 'admin';

type AuthenticatedUser = {
  type: 'AUTHENTICATED';
  user: User;
  roles: UserRole[];
};

type UserStatus =
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
            .catch(() => {});
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
