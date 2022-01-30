import { useMediaQuery } from '../../utils/useMediaQuery';
import styles from './ScreenSize.module.css';

interface Props {
  children: React.ReactNode;
}

export const OnMobile = ({ children }: Props) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  if (isMobile) {
    return <div className={styles.mobile}>{children}</div>;
  }
  return null;
};

export const OnDesktop = ({ children }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 601px)');
  if (isDesktop) {
    return <div className={styles.desktop}>{children}</div>;
  }
  return null;
};
