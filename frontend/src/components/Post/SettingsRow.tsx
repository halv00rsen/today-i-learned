import { useCallback, useState } from 'react';
import { Button } from '../Button/Button';
import { Popup } from '../Popup/Popup';
import { FitlerContainer } from './FilterContainer';
import styles from './SettingsRow.module.css';

export const SettingsRow = () => {
  const [showFilter, setShowFilter] = useState(false);

  const closeFilter = useCallback(() => {
    setShowFilter(false);
  }, []);

  return (
    <div className={styles.settingsRow}>
      <Button
        size="small"
        onClick={() => setShowFilter(!showFilter)}
      >
        Filter
      </Button>
      <Popup onClose={closeFilter} open={showFilter}>
        <FitlerContainer onFinished={closeFilter} />
      </Popup>
    </div>
  );
};
