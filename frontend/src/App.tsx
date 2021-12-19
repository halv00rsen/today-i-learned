import styles from './App.module.css';
import { TextProvider } from './context/TextContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import { TagContextWrapper } from './context/TagContext';
import { AppRouter } from './views/AppRouter';
import { SettingsProvider } from './context/SettingsContext';

const App = () => {
  return (
    <ThemeWrapper>
      <SettingsProvider>
        <TextProvider>
          <TagContextWrapper>
            <div className={styles.wrapper}>
              <AppRouter />
            </div>
          </TagContextWrapper>
        </TextProvider>
      </SettingsProvider>
    </ThemeWrapper>
  );
};

export default App;
