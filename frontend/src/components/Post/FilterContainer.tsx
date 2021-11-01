import classNames from 'classnames';
import { useState } from 'react';
import { useTagProvider } from '../../context/TagContext';
import { Tag } from '../../service/tag';
import styles from './FilterContainer.module.css';

interface TagProps {
  tag: Tag;
  chosen: boolean;
  onClick: () => void;
}

const TagComponent = ({ tag, chosen, onClick }: TagProps) => {
  return (
    <div
      className={classNames(styles.tag, {
        [styles.chosenTag]: chosen,
      })}
      role={'checkbox'}
      aria-checked={chosen}
      onClick={onClick}
    >
      {tag.name}
    </div>
  );
};

interface Props {
  onFinished: () => void;
}

export const FitlerContainer = ({ onFinished }: Props) => {
  const { allTags, setActiveTags } = useTagProvider();

  const [chosenTags, setChosenTags] = useState<Tag[]>([]);

  return (
    <div>
      <div>Velg hvilke emneknagger du vil filtrere på.</div>
      <button
        onClick={() => {
          setActiveTags(chosenTags);
          onFinished();
        }}
      >
        Lagre
      </button>
      <button
        onClick={() => {
          setChosenTags([]);
          setActiveTags([]);
          onFinished();
        }}
      >
        Fjern alle
      </button>
      {allTags.map((tag) => {
        const chosen = chosenTags.some((t) => t.name === tag.name);
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
  );
};
