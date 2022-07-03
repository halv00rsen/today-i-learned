import classNames from 'classnames';
import { useState } from 'react';
import { useTagProvider } from '../../context/TagContext';
import { useTextsPrefix } from '../../context/TextContext';
import { Tag } from '../../service/tag';
import { Button } from '../Button/Button';
import { Text } from '../Texts/Text';
import styles from './FilterContainer.module.css';

interface TagProps {
  tag: Tag;
  chosen: boolean;
  onClick: () => void;
}

const TagComponent = ({ tag, chosen, onClick }: TagProps) => {
  return (
    <label>
      <input
        className={classNames(styles.tag, {
          [styles.chosenTag]: chosen,
        })}
        type={'checkbox'}
        checked={chosen}
        onChange={onClick}
      />
      {tag.name}
    </label>
  );
};

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
      <Text value="TITLE" texts={texts} tag="h3" />
      <div>
        {allTags.map((tag) => {
          const chosen = chosenTags.some(
            (t) => t.name === tag.name
          );
          return (
            <TagComponent
              key={tag.id}
              tag={tag}
              chosen={chosen}
              onClick={() => {
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
