import React from 'react';
import { User } from 'firebase/auth';
import { useSetTheme, useTheme } from '../components/ThemeWrapper';
import { useUserStatus } from '../utils/useUserStatus';
import styles from './SettingsView.module.css';
import classNames from 'classnames';

export const SettingsView = () => {
  const theme = useTheme();
  const setTheme = useSetTheme();
  const userStatus = useUserStatus();

  return (
    <div>
      <h3>Instillinger</h3>
      <div
        className={classNames(styles.userEntry, styles.editable)}
        role="button"
        onClick={() =>
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }
      >
        <div>Nattmodus</div>
        <div>{theme === 'dark' ? 'På' : 'Av'}</div>
      </div>
      {userStatus.type === 'AUTHENTICATED' && (
        <UserProfile
          roles={userStatus.roles}
          user={userStatus.user}
        />
      )}
    </div>
  );
};

interface UserProfileProps {
  user: User;
  roles: string[];
}

const UserProfile = ({ user, roles }: UserProfileProps) => {
  return (
    <>
      <h3>Brukerinfo</h3>
      <div className={styles.userEntry}>
        <div>Navn</div> <div>{user.displayName}</div>
      </div>
      <div className={styles.userEntry}>
        <div>Epost</div> <div>{user.email}</div>
      </div>
      <div className={styles.userEntry}>
        <div>Roles</div> <div>{roles.join(', ')}</div>
      </div>
    </>
  );
};
