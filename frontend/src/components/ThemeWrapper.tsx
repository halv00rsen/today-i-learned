import styles from './ThemeWrapper.module.css';
import './ThemeWrapper.css';

interface Props {
  children: React.ReactNode;
}

export const ThemeWrapper = ({ children }: Props) => {
  return <div className={styles.themeWrapper}>{children}</div>;
};
