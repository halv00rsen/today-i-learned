import styles from './ScreenSize.module.css';

interface Props {
  children: React.ReactNode;
}

export const OnMobile = ({ children }: Props) => {
  return <div className={styles.mobile}>{children}</div>;
};

export const OnDesktop = ({ children }: Props) => {
  return <div className={styles.desktop}>{children}</div>;
};
