import React from 'react';
import styles from './App.module.css';
import { ThemeWrapper } from './components/ThemeWrapper';
import { TagContextWrapper } from './context/TagContext';
import { AppRouter } from './views/AppRouter';

const App = () => {
  return (
    <ThemeWrapper>
      <TagContextWrapper>
        <div className={styles.wrapper}>
          <AppRouter />
        </div>
      </TagContextWrapper>
    </ThemeWrapper>
  );
};

export default App;
