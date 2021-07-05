import React from 'react';
import { useSetTheme, useTheme } from '../components/ThemeWrapper';

export const SettingsView = () => {
  const theme = useTheme();
  const setTheme = useSetTheme();
  return (
    <div>
      <input
        type="checkbox"
        name="themeSwitch"
        checked={theme === 'dark'}
        onChange={(e) => {
          setTheme(e.target.checked ? 'dark' : 'light');
        }}
      />
      <label htmlFor="themeSwitch">Nattmodus</label>
    </div>
  );
};
