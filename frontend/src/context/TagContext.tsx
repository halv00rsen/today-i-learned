import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTags, Tag } from '../service/tag';
import { isNonEmptyArray, NonEmptyArray } from '../utils/array';

interface TagProvider {
  readonly allTags: Tag[];
  activeTags?: NonEmptyArray<Tag>;
  setActiveTags: (tags: Tag[]) => void;
}

const TagContext = createContext<TagProvider | undefined>(
  undefined
);

export const useTagProvider = (): TagProvider => {
  const tagContext = useContext(TagContext);
  if (!tagContext) {
    throw new Error('Not wrapped in TagContextWrapper');
  }
  return tagContext;
};

interface Props {
  children: React.ReactNode;
}

export const TagContextWrapper = ({ children }: Props) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags().then((tags) => {
      setAllTags([...tags]);
    });
  }, []);

  return (
    <TagContext.Provider
      value={{
        activeTags: isNonEmptyArray(activeTags)
          ? activeTags
          : undefined,
        allTags,
        setActiveTags,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};
