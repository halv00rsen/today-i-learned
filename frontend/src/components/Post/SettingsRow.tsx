import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FitlerContainer } from './FilterContainer';
import styles from './SettingsRow.module.css';

export const SettingsRow = () => {
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const hideOnEscape = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener('keydown', hideOnEscape);
    }
    return () => {
      document.removeEventListener('keydown', hideOnEscape);
    };
  }, [showFilter]);

  return (
    <div className={styles.settingsRow}>
      <button onClick={() => setShowFilter(!showFilter)}>
        Filter
      </button>
      <div
        className={classNames(styles.popup, {
          [styles.hidden]: !showFilter,
        })}
      >
        <button onClick={() => setShowFilter(false)}>Lukk</button>
        <FitlerContainer onFinished={() => setShowFilter(false)} />
      </div>
      {showFilter && (
        <div
          className={classNames(styles.overlay)}
          onClick={() => setShowFilter(false)}
        />
      )}
    </div>
  );
};
