import headerImg from '../../public/android-chrome-512x512.png';
import { Link } from 'react-router-dom';
import { useTextsPrefix } from '../context/TextContext';
import { isAdmin, useUserStatus } from '../utils/useUserStatus';
import styles from './Header.module.css';
import { Text } from './Texts/Text';
import classNames from 'classnames';
import { useState } from 'react';
import { Popup } from './Popup/Popup';
import { Button } from './Button/Button';

interface Props {
  onLinkClick?: () => void;
}

const LinkMenu = ({ onLinkClick }: Props) => {
  const userStatus = useUserStatus();
  const texts = useTextsPrefix('HEADER');
  return (
    <>
      <Link
        className={classNames(
          styles.headerLink,
          styles.mobileOnly
        )}
        to="/"
        data-test-id="header-home"
        onClick={onLinkClick}
      >
        <Text value="HOME" texts={texts} tag="text" />
      </Link>
      {userStatus.type === 'AUTHENTICATED' && (
        <>
          {isAdmin(userStatus) && (
            <Link
              className={styles.headerLink}
              to="/add-post"
              data-test-id="header-add-posts"
              onClick={onLinkClick}
            >
              <Text value="NEWPOST" texts={texts} tag="text" />
            </Link>
          )}
          <Link
            className={styles.headerLink}
            to="/my-posts"
            onClick={onLinkClick}
          >
            <Text value="MYPOSTS" texts={texts} tag="text" />
          </Link>
        </>
      )}
      {userStatus.type === 'UNAUTHENTICATED' && (
        <Link
          className={styles.headerLink}
          to="/login"
          data-test-id="header-login"
          onClick={onLinkClick}
        >
          <Text value="LOGIN" texts={texts} tag="text" />
        </Link>
      )}
      <Link
        className={styles.headerLink}
        to="/settings"
        data-test-id="header-settings"
        onClick={onLinkClick}
      >
        <Text value="SETTINGS" texts={texts} tag="text" />
      </Link>
    </>
  );
};

const MobileLinkMenu = () => {
  const [open, setOpen] = useState(false);
  const texts = useTextsPrefix('HEADER');
  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        <Text value="MENU" texts={texts} />
      </Button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        closeButtonOnBottom
      >
        <div className={styles.mobileLinks}>
          <LogoTitle />
          <LinkMenu onLinkClick={() => setOpen(false)} />
        </div>
      </Popup>
    </>
  );
};

const LogoTitle = () => {
  const texts = useTextsPrefix('HEADER');

  return (
    <div className={styles.logoHeader}>
      <img
        src={headerImg}
        height={60}
        width={60}
        className={styles.logo}
      />
      <Text value="TITLE" texts={texts} tag="h3" />
    </div>
  );
};

export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerName}>
        <Link
          className={styles.headerLink}
          to="/"
          data-test-id="header-title"
        >
          <LogoTitle />
        </Link>
      </div>
      <div className={styles.headerLinks}>
        <LinkMenu />
      </div>
      <div className={styles.mobileLinkMenu}>
        <MobileLinkMenu />
      </div>
    </div>
  );
};
