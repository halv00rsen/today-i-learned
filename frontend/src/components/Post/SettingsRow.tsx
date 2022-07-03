import { useCallback, useState } from 'react';
import { useTexts } from '../../context/TextContext';
import { Button } from '../Button/Button';
import { Popup } from '../Popup/Popup';
import { Text } from '../Texts/Text';
import { FitlerContainer } from './FilterContainer';
import styles from './SettingsRow.module.css';

export const SettingsRow = () => {
  const texts = useTexts();

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
        <Text value="SHARED.FILTER" texts={texts} tag="text" />
      </Button>
      <Popup onClose={closeFilter} open={showFilter}>
        <FitlerContainer onFinished={closeFilter} />
      </Popup>
    </div>
  );
};
