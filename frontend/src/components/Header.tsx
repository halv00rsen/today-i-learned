import { Link } from 'react-router-dom';
import { isAdmin, useUserStatus } from '../utils/useUserStatus';
import styles from './Header.module.css';

export const Header = () => {
  const userStatus = useUserStatus();

  return (
    <div className={styles.header}>
      <div className={styles.headerName}>
        <Link className={styles.headerLink} to="/">
          Today I learned
        </Link>
      </div>
      <div className={styles.headerLinks}>
        {userStatus.type === 'AUTHENTICATED' && (
          <>
            {isAdmin(userStatus) && (
              <Link className={styles.headerLink} to="/addPost">
                Ny post
              </Link>
            )}
            <Link className={styles.headerLink} to="/my-posts">
              Mine poster
            </Link>
          </>
        )}
        {userStatus.type === 'UNAUTHENTICATED' && (
          <Link className={styles.headerLink} to="/login">
            Logg inn
          </Link>
        )}
        <Link className={styles.headerLink} to="/settings">
          Innstillinger
        </Link>
      </div>
    </div>
  );
};
