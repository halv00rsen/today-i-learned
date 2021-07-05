import React from 'react';
import styles from './App.module.css';
import { ThemeWrapper } from './components/ThemeWrapper';
import { AppRouter } from './views/AppRouter';

const App = () => {
  return (
    <ThemeWrapper>
      <div className={styles.wrapper}>
        <AppRouter />
      </div>
    </ThemeWrapper>
  );
};

export default App;
