import React, { createContext, useContext, useState } from 'react';
import styles from './ThemeWrapper.module.css';
import './ThemeWrapper.css';

type Theme = 'dark' | 'light';

interface ThemeProvider {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeProvider>({
  theme: 'dark',
  setTheme: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const useTheme = () => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

export const useSetTheme = () => {
  const { setTheme } = useContext(ThemeContext);
  return setTheme;
};

export const ThemeWrapper = ({ children }: Props) => {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme} className={styles.themeWrapper}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
