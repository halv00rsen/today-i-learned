import { useState } from 'react';
import { useTagProvider } from '../../context/TagContext';
import { useTextsPrefix } from '../../context/TextContext';
import { Tag } from '../../service/tag';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Text } from '../Texts/Text';
import styles from './FilterContainer.module.css';

interface Props {
  onFinished: () => void;
}

export const FitlerContainer = ({ onFinished }: Props) => {
  const texts = useTextsPrefix('FILTERS');

  const { allTags, setActiveTags, activeTags } = useTagProvider();

  const [chosenTags, setChosenTags] = useState<Tag[]>(
    activeTags ? [...activeTags] : []
  );

  return (
    <div>
      <Text
        value="TITLE"
        texts={texts}
        tag="h3"
        className={styles.header}
      />
      <div className={styles.content}>
        {allTags.map((tag) => {
          const chosen = chosenTags.some(
            (t) => t.name === tag.name
          );
          return (
            <Checkbox
              key={tag.id}
              checked={chosen}
              label={tag.name}
              onChange={() => {
                if (chosen) {
                  setChosenTags(
                    chosenTags.filter((t) => t.name !== tag.name)
                  );
                } else {
                  setChosenTags([...chosenTags, tag]);
                }
              }}
            />
          );
        })}
      </div>
      <div className={styles.buttonRow}>
        <Button
          onClick={() => {
            setActiveTags(chosenTags);
            onFinished();
          }}
        >
          <Text value="SHARED.SAVE" texts={texts} tag="text" />
        </Button>
        <Button
          onClick={() => {
            setChosenTags([]);
            setActiveTags([]);
            onFinished();
          }}
        >
          <Text
            value="SHARED.REMOVEALL"
            texts={texts}
            tag="text"
          />
        </Button>
      </div>
    </div>
  );
};
