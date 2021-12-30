import styles from './App.module.css';
import { TextProvider } from './context/TextContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import { TagContextWrapper } from './context/TagContext';
import { AppRouter } from './views/AppRouter';
import { SettingsProvider } from './context/SettingsContext';
import { CookieConsentWrapper } from './components/CookieConsentWrapper';
import { AlertWrapper } from './components/Alert/Alert';

const App = () => {
  return (
    <SettingsProvider>
      <ThemeWrapper>
        <TextProvider>
          <AlertWrapper>
            <CookieConsentWrapper>
              <TagContextWrapper>
                <div className={styles.wrapper}>
                  <AppRouter />
                </div>
              </TagContextWrapper>
            </CookieConsentWrapper>
          </AlertWrapper>
        </TextProvider>
      </ThemeWrapper>
    </SettingsProvider>
  );
};

export default App;
