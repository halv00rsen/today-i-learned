import React from 'react';
import { signOut, User } from 'firebase/auth';
import { useSetTheme, useTheme } from '../components/ThemeWrapper';
import { useUserStatus } from '../utils/useUserStatus';
import styles from './SettingsView.module.css';
import classNames from 'classnames';
import { isNonEmptyArray } from '../utils/array';
import { getFormattedDateWithTime } from '../utils/time';
import { firebaseAuth } from '../firebase';

interface EntryProps {
  title: string;
  value: string;
}

const InfoEntry = ({ title, value }: EntryProps) => {
  return (
    <div className={classNames(styles.userEntry)}>
      <div>{title}</div>
      <div>{value}</div>
    </div>
  );
};

const getClientDeployTime = () => {
  const time = process.env.REACT_APP_CLIENT_DEPLOY_TIME;
  if (time) {
    return new Date(time);
  } else {
    return new Date();
  }
};

const clientVersion =
  process.env.REACT_APP_CLIENT_VERSION || 'not-set';
const clientDeployTime = getClientDeployTime();

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
      <h3>Klientinformasjon</h3>
      <InfoEntry title="Versjon" value={clientVersion} />
      <InfoEntry
        title="Byggtidspunkt"
        value={getFormattedDateWithTime(clientDeployTime)}
      />
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
        <div>Roller</div>
        <div>
          {isNonEmptyArray(roles) ? roles.join(', ') : 'Ingen'}
        </div>
      </div>
      <button
        className={styles.logoutButton}
        onClick={() => signOut(firebaseAuth)}
      >
        Logg ut
      </button>
    </>
  );
};
