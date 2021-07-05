import { signOut } from '@firebase/auth';
import React from 'react';
import { useHistory } from 'react-router';
import { firebaseAuth } from '../firebase';
import { useUserStatus } from '../utils/useUserStatus';

export const Header = () => {
  const userStatus = useUserStatus();
  const history = useHistory();

  return (
    <div>
      {userStatus.type === 'AUTHENTICATED' && (
        <div>
          <div>Logget inn som {userStatus.user.displayName}</div>
          <button onClick={() => signOut(firebaseAuth)}>
            Logg ut
          </button>
          <button onClick={() => history.push('/addPost')}>
            Legg til post
          </button>
        </div>
      )}
      {userStatus.type === 'UNAUTHENTICATED' && (
        <div>
          <button onClick={() => history.push('/login')}>
            Logg inn
          </button>
        </div>
      )}
      <button onClick={() => history.push('/')}>Hjem</button>
      <button onClick={() => history.push('/settings')}>
        Innstillinger
      </button>
    </div>
  );
};
