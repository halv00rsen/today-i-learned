import {
  faCheckCircle,
  faPencil,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timestamp } from 'firebase/firestore';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Texts } from '../../utils/texts';
import { PartialPost, StoredPost } from '../../utils/types/domain';
import { Button, IconButton } from '../Button/Button';
import { Editor } from '../Editor/Editor';
import { Input } from '../Input/Input';
import { Popup } from '../Popup/Popup';
import { Post } from '../Post/Post';
import { OnDesktop, OnMobile } from '../ScreenSize/ScreenSize';
import { Tabs } from '../Tabs/Tabs';
import { getText, Text } from '../Texts/Text';
import styles from './EditPost.module.css';

interface PostContext {
  partialPost: PartialPost;
  setPartialPost: (partialPost: PartialPost) => void;
}

const initialPartialPost: PartialPost = {
  content: '',
  published: false,
  tags: [],
  title: '',
};

const PostsCreatingContext = createContext<PostContext>({
  partialPost: {} as PartialPost,
  setPartialPost: console.log,
});

const toPartialPost = (
  post: StoredPost | PartialPost
): PartialPost => ({
  content: post.content,
  published: post.published,
  tags: post.tags,
  title: post.title,
  subtitle: post.subtitle,
});

const getSanitizedPost = (): { post: PartialPost; id: string } => {
  const partialPost = sessionStorage.getItem(STORAGE_KEY);
  if (!partialPost) {
    throw new Error('Missing post in session storage');
  }
  const { post, id } = JSON.parse(partialPost) as {
    post: PartialPost;
    id: string;
  };

  return {
    post: toPartialPost(post),
    id,
  };
};

const STORAGE_KEY = 'partial-post';
const NEW_POST_ID = 'new-post-id';
const SAVE_TIMEOUT = 1500;

const getInitialStoragePost = (
  initialPost?: StoredPost
): PartialPost => {
  try {
    const { post, id } = getSanitizedPost();
    if (initialPost) {
      if (initialPost.id === id) {
        return post;
      }
      return toPartialPost(initialPost);
    }
    if (id === NEW_POST_ID) {
      return post;
    }
    return initialPartialPost;
  } catch {
    return (
      (initialPost && toPartialPost(initialPost)) ||
      initialPartialPost
    );
  }
};

const clearStorage = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

interface Props {
  onClick: (post: PartialPost) => void;
  onRemove: () => void;
  texts: Texts;

  initialPost?: StoredPost;
  disabled?: boolean;
}

export const EditPost = ({
  onClick,
  onRemove,
  texts,
  disabled = false,
  initialPost,
}: Props) => {
  const [partialPost, setPartialPost] = useState<PartialPost>(() =>
    getInitialStoragePost(initialPost)
  );
  const [published, setPublished] = useState(
    initialPost?.published || false
  );
  const { id: postId = NEW_POST_ID } = initialPost || {};

  const [persistedStatus, setPersistedStatus] = useState<
    'saved' | 'changing'
  >('saved');

  const [editTags, setEditTags] = useState(false);

  const { tags } = partialPost;
  const [tag, setTag] = useState('');

  const removeTag = (tag: string) => {
    setPartialPost({
      ...partialPost,
      tags: tags.filter((t) => t !== tag),
    });
  };

  const addTag = () => {
    const lowercaseTag = tag.toLowerCase();
    if (!lowercaseTag || tags.includes(lowercaseTag)) {
      setTag('');
      return;
    }
    setPartialPost({
      ...partialPost,
      tags: [...tags, lowercaseTag],
    });
    setTag('');
  };
  useEffect(() => {
    setPersistedStatus('changing');
    const timeout = setTimeout(() => {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          post: partialPost,
          id: postId,
        })
      );
      setPersistedStatus('saved');
    }, SAVE_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, [partialPost, postId]);

  return (
    <PostsCreatingContext.Provider
      value={{
        setPartialPost,
        partialPost,
      }}
    >
      <OnDesktop>
        <div className={styles.splitView}>
          <EditorView disabled={disabled} texts={texts} />
          <Preview />
        </div>
      </OnDesktop>
      <MobileView disabled={disabled} texts={texts} />
      <div className={styles.tools}>
        {persistedStatus === 'saved' ? (
          <div style={{ color: 'green' }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={styles.statusIcon}
            />
            <Text texts={texts} value="PERSISTED" tag="text" />
          </div>
        ) : (
          <div>
            <FontAwesomeIcon
              icon={faPencil}
              className={styles.statusIcon}
            />
            <Text texts={texts} value="EDITING" tag="text" />
          </div>
        )}
        <div className={styles.buttonRow}>
          <div>
            <label>
              <Text value="publish" texts={texts} tag="label" />
              <input
                data-test-id="publish-checkbox"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            </label>
          </div>
          <div className={styles.popupAchor}>
            <Popup
              open={editTags}
              onClose={() => setEditTags(false)}
              closeButtonOnBottom={true}
              relative={{ direction: 'above' }}
            >
              <Text value="HASHTAG.TITLE" texts={texts} tag="h3" />
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <React.Fragment key={tag}>
                    <div>{tag}</div>
                    <div>
                      <IconButton
                        inline={true}
                        onClick={() => removeTag(tag)}
                        icon={<FontAwesomeIcon icon={faRemove} />}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <Input
                data-test-id="edit-post-tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <Button
                inline={true}
                onClick={addTag}
                data-test-id="add-tag-button"
              >
                <Text
                  value="HASHTAG.ADD"
                  texts={texts}
                  tag="text"
                />
              </Button>
            </Popup>
            <Button
              inline={true}
              onClick={() => setEditTags(!editTags)}
            >
              <Text
                value="HASHTAG.TITLE"
                texts={texts}
                tag="text"
              />
            </Button>
          </div>
          <Button
            data-test-id="save-post-button"
            onClick={() =>
              onClick({
                ...partialPost,
                published,
              })
            }
            disabled={disabled}
          >
            <Text value="save" texts={texts} tag="text" />
          </Button>
          <Button
            data-test-id="delete-post-button"
            onClick={() => {
              clearStorage();
              onRemove();
            }}
            className={styles.deleteButton}
            disabled={disabled}
          >
            <Text value="delete" texts={texts} tag="text" />
          </Button>
        </div>
      </div>
    </PostsCreatingContext.Provider>
  );
};

const EditorView = ({
  texts,
  disabled,
}: {
  texts: Texts;
  disabled: boolean;
}) => {
  const { partialPost, setPartialPost } = useContext(
    PostsCreatingContext
  );

  const { content, title } = partialPost;

  return (
    <>
      <div>
        <input
          data-test-id="edit-post-title"
          type="text"
          disabled={disabled}
          value={title}
          placeholder={getText({ texts, value: 'TITLE' })}
          className={styles.headerInput}
          onChange={(e) =>
            setPartialPost({
              ...partialPost,
              title: e.target.value,
            })
          }
        />
        <Editor
          disabled={disabled}
          onChange={(content) =>
            setPartialPost({
              ...partialPost,
              content,
            })
          }
          initialValue={content}
        />
      </div>
    </>
  );
};

const Preview = () => {
  const { partialPost } = useContext(PostsCreatingContext);

  return (
    <div>
      <Post
        className={styles.noMargin}
        post={{
          ...partialPost,
          id: 'mock-id',
          ownerId: 'something',
          published: true,
          publishDate: Timestamp.now(),
        }}
      />
    </div>
  );
};

const MobileView = ({
  texts,
  disabled,
}: {
  texts: Texts;
  disabled: boolean;
}) => {
  return (
    <OnMobile>
      <Tabs
        tabs={[
          {
            id: 'editor',
            tabTitle: 'Editor',
            content: (
              <EditorView disabled={disabled} texts={texts} />
            ),
          },
          {
            id: 'preview',
            tabTitle: 'Preview',
            content: <Preview />,
          },
        ]}
      />
    </OnMobile>
  );
};
