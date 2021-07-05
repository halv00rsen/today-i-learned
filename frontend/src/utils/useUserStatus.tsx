import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

type UserStatus =
  | {
      type: 'UNKNOWN';
    }
  | {
      type: 'UNAUTHENTICATED';
    }
  | {
      type: 'AUTHENTICATED';
      user: User;
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
          setUserStatus({
            type: 'AUTHENTICATED',
            user,
          });
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
