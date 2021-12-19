import { createContext, useContext, useState } from 'react';
import { Language } from '../utils/texts';

const SETTINGS_KEY = 'settings';

const defaultSettings: Settings = {
  language: 'NO',
};

const getSettingsLocalStorage = (): Settings => {
  const settingsString = localStorage.getItem(SETTINGS_KEY);
  if (settingsString) {
    const settings = JSON.parse(
      settingsString
    ) as Partial<Settings>;
    if (typeof settings === 'object') {
      return {
        ...defaultSettings,
        ...settings,
      };
    }
  }
  return {
    ...defaultSettings,
  };
};

interface Settings {
  language: Language;
}

interface SettingsData {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsData | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export const useSettings = (): SettingsData => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('Missing settings provider');
  }
  return context;
};

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState(
    getSettingsLocalStorage()
  );

  const updateSettings = (settings: Settings) => {
    setSettings(settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
