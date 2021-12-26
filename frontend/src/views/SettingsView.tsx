import { signOut, User } from 'firebase/auth';
import { isAdmin, useUserStatus } from '../utils/useUserStatus';
import styles from './SettingsView.module.css';
import classNames from 'classnames';
import { isNonEmptyArray } from '../utils/array';
import { getFormattedDateWithTime } from '../utils/time';
import { firebaseAuth } from '../firebase';
import { Button } from '../components/Button/Button';
import { getText, Text } from '../components/Texts/Text';
import { useTextsPrefix } from '../context/TextContext';
import {
  isSupportedLanguage,
  languages,
  Texts,
} from '../utils/texts';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

interface EntryProps {
  title: string;
  value: string;
  texts: Texts;
}

const InfoEntry = ({ title, value, texts }: EntryProps) => {
  return (
    <div className={classNames(styles.userEntry)}>
      <Text value={title} texts={texts} tag="div" />
      <div>{value}</div>
    </div>
  );
};

const getClientDeployTime = () => {
  const time = import.meta.env.VITE_CLIENT_DEPLOY_TIME as string;
  if (time) {
    return new Date(time);
  } else {
    return new Date();
  }
};

const clientVersion =
  (import.meta.env.VITE_CLIENT_VERSION as string) || 'not-set';
const clientDeployTime = getClientDeployTime();

export const SettingsView = () => {
  const texts = useTextsPrefix('SETTINGS');
  const userinfoTexts = useTextsPrefix('USERINFO', texts);
  const languageTexts = useTextsPrefix('LANGUAGE', texts);

  const userStatus = useUserStatus();

  const { settings, updateSettings } = useSettings();

  return (
    <div>
      <Text value="TITLE" texts={texts} tag="h3" />
      <div
        className={classNames(styles.userEntry, styles.editable)}
        role="button"
        onClick={() =>
          updateSettings({
            ...settings,
            theme: settings.theme === 'dark' ? 'light' : 'dark',
          })
        }
      >
        <Text value="NIGHTMODE" texts={texts} tag="div" />
        <Text
          value={settings.theme === 'dark' ? 'ON' : 'OFF'}
          texts={texts}
          tag="div"
        />
      </div>
      <div className={classNames(styles.userEntry)}>
        <Text value="LANGUAGE" texts={texts} tag="div" />
        <div>
          <select
            value={settings.language}
            onChange={(event) => {
              const language = event.target.value;
              if (isSupportedLanguage(language)) {
                updateSettings({
                  ...settings,
                  language,
                });
              }
            }}
          >
            {languages.map((language) => (
              <option value={language} key={language}>
                {getText({
                  texts: languageTexts,
                  value: language,
                })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {userStatus.type === 'AUTHENTICATED' && (
        <UserProfile
          texts={userinfoTexts}
          roles={userStatus.roles}
          user={userStatus.user}
        />
      )}
      <Text value="CLIENTINFO" texts={texts} tag="h3" />
      <InfoEntry
        title="VERSION"
        value={clientVersion}
        texts={texts}
      />
      <InfoEntry
        title="BUILDTIME"
        texts={texts}
        value={getFormattedDateWithTime(clientDeployTime)}
      />
      {userStatus.type === 'AUTHENTICATED' &&
        isAdmin(userStatus) && (
          <Link to="/settings/admin">Admin-side</Link>
        )}
    </div>
  );
};

interface UserProfileProps {
  user: User;
  roles: string[];
  texts: Texts;
}

const UserProfile = ({ user, roles, texts }: UserProfileProps) => {
  return (
    <>
      <Text value="TITLE" texts={texts} tag="h3" />
      <div className={styles.userEntry}>
        <Text value="NAME" texts={texts} tag="div" />
        <div>{user.displayName}</div>
      </div>
      <div className={styles.userEntry}>
        <Text value="EMAIL" texts={texts} tag="div" />
        <div>{user.email}</div>
      </div>
      <div className={styles.userEntry}>
        <Text value="ROLES" texts={texts} tag="div" />
        <div>
          {isNonEmptyArray(roles) ? roles.join(', ') : 'Ingen'}
        </div>
      </div>
      <Button
        data-test-id="logout-button"
        className={styles.logoutButton}
        center={true}
        onClick={() => signOut(firebaseAuth)}
      >
        <Text value="LOGOUT" texts={texts} tag="div" />
      </Button>
    </>
  );
};
