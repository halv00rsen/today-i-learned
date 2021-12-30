import { createContext, useContext, useState } from 'react';
import { Language } from '../utils/texts';

interface Settings {
  language: Language;
  theme: Theme;
  cookieConsent: 'not_answered' | 'denied' | 'allowed';
}

type Theme = 'dark' | 'light';

const SETTINGS_KEY = 'settings';

const defaultSettings: Settings = {
  language: 'NO',
  theme: 'dark',
  cookieConsent: 'not_answered',
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
    if (settings.cookieConsent === 'allowed') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } else {
      localStorage.clear();
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      <div
        data-theme={settings.theme}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
};
