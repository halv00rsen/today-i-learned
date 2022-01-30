import { Timestamp } from 'firebase/firestore';
import { createContext, useContext, useState } from 'react';
import { Texts } from '../../utils/texts';
import { PartialPost } from '../../utils/types/domain';
import { Button } from '../Button/Button';
import { Editor } from '../Editor/Editor';
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

interface Props {
  onClick: (post: PartialPost) => void;
  texts: Texts;

  initialPost?: PartialPost;
  disabled?: boolean;
}

export const EditPost = ({
  onClick,
  texts,
  disabled = false,
  initialPost,
}: Props) => {
  const [partialPost, setPartialPost] = useState<PartialPost>(
    initialPost || initialPartialPost
  );
  const [published, setPublished] = useState(
    initialPost?.published || false
  );

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
          <Preview texts={texts} />
        </div>
      </OnDesktop>
      <MobileView disabled={disabled} texts={texts} />
      <div>
        <Text value="publish" texts={texts} tag="text" />
        <input
          data-test-id="publish-checkbox"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
      </div>
      <Button
        data-test-id="save-post-button"
        size="medium"
        center={true}
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

  const { content, tags, title } = partialPost;
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
  return (
    <>
      <div>
        <Text value="TITLE" texts={texts} tag="h4" />
        <input
          data-test-id="edit-post-title"
          type="text"
          disabled={disabled}
          value={title}
          placeholder={getText({ texts, value: 'TITLE' })}
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
        <div>
          <Text value="HASHTAG.TITLE" texts={texts} />
          <ul>
            {tags.map((tag) => (
              <li key={tag}>
                {tag}{' '}
                <Button
                  inline={true}
                  onClick={() => removeTag(tag)}
                >
                  <Text
                    value="SHARED.REMOVE"
                    texts={texts}
                    tag="text"
                  />
                </Button>
              </li>
            ))}
          </ul>
          <input
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
            <Text value="HASHTAG.ADD" texts={texts} tag="text" />
          </Button>
        </div>
      </div>
    </>
  );
};

const Preview = ({ texts }: { texts: Texts }) => {
  const { partialPost } = useContext(PostsCreatingContext);

  return (
    <div>
      <Text value="preview.title" texts={texts} tag="h4" />
      <Post
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
            content: <Preview texts={texts} />,
          },
        ]}
      />
    </OnMobile>
  );
};
