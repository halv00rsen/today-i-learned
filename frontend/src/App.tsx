import styles from './App.module.css';
import { TextProvider } from './context/TextContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import { SettingsProvider } from './context/SettingsContext';
import { CookieConsentWrapper } from './components/CookieConsentWrapper';
import { AlertWrapper } from './components/Alert/Alert';
import { lazy, Suspense } from 'react';
import { Spinner } from './components/Spinner/Spinner';

const AppRouter = lazy(() =>
  import('./views/AppRouter').then((module) => ({
    default: module.AppRouter,
  }))
);

const App = () => {
  return (
    <SettingsProvider>
      <ThemeWrapper>
        <TextProvider>
          <AlertWrapper>
            <CookieConsentWrapper>
              <div className={styles.wrapper}>
                <Suspense fallback={<Spinner />}>
                  <AppRouter />
                </Suspense>
              </div>
            </CookieConsentWrapper>
          </AlertWrapper>
        </TextProvider>
      </ThemeWrapper>
    </SettingsProvider>
  );
};

export default App;
