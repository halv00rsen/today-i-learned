import { Link } from 'react-router-dom';
import { useTextsPrefix } from '../context/TextContext';
import { isAdmin, useUserStatus } from '../utils/useUserStatus';
import styles from './Header.module.css';
import { Text } from './Texts/Text';

export const Header = () => {
  const userStatus = useUserStatus();
  const texts = useTextsPrefix('HEADER');

  return (
    <div className={styles.header}>
      <div className={styles.headerName}>
        <Link
          className={styles.headerLink}
          to="/"
          data-test-id="header-title"
        >
          <Text value="TITLE" texts={texts} />
        </Link>
      </div>
      <div className={styles.headerLinks}>
        {userStatus.type === 'AUTHENTICATED' && (
          <>
            {isAdmin(userStatus) && (
              <Link
                className={styles.headerLink}
                to="/add-post"
                data-test-id="header-add-posts"
              >
                <Text value="NEWPOST" texts={texts} tag="text" />
              </Link>
            )}
            <Link className={styles.headerLink} to="/my-posts">
              <Text value="MYPOSTS" texts={texts} tag="text" />
            </Link>
          </>
        )}
        {userStatus.type === 'UNAUTHENTICATED' && (
          <Link
            className={styles.headerLink}
            to="/login"
            data-test-id="header-login"
          >
            <Text value="LOGIN" texts={texts} tag="text" />
          </Link>
        )}
        <Link
          className={styles.headerLink}
          to="/settings"
          data-test-id="header-settings"
        >
          <Text value="SETTINGS" texts={texts} tag="text" />
        </Link>
      </div>
    </div>
  );
};
