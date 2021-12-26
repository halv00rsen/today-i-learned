import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Texts } from '../../utils/texts';
import { PartialPost } from '../../utils/types/domain';
import { Button } from '../Button/Button';
import { Editor } from '../Editor/Editor';
import { Post } from '../Post/Post';
import { getText, Text } from '../Texts/Text';
import styles from './EditPost.module.css';

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
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [content, setContent] = useState(
    initialPost?.content ?? ''
  );
  const [tags, setTags] = useState<string[]>(
    initialPost?.tags ?? []
  );
  const [subtitle] = useState(initialPost?.subtitle || '');

  const [tag, setTag] = useState('');

  const [published, setPublished] = useState(
    initialPost?.published || false
  );

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addTag = () => {
    const lowercaseTag = tag.toLowerCase();
    if (!lowercaseTag || tags.includes(lowercaseTag)) {
      setTag('');
      return;
    }
    setTags([...tags, lowercaseTag]);
    setTag('');
  };

  const getPost = (): PartialPost => ({
    content,
    tags,
    title,
    subtitle,
    published,
  });

  return (
    <div>
      <div className={styles.splitView}>
        <div>
          <Text value="TITLE" texts={texts} tag="h4" />
          <input
            data-test-id="edit-post-title"
            type="text"
            disabled={disabled}
            value={title}
            placeholder={getText({ texts, value: 'TITLE' })}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Editor
            disabled={disabled}
            onChange={setContent}
            initialValue={initialPost?.content}
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
        <div>
          <Text value="preview.title" texts={texts} tag="h4" />
          <Post
            post={{
              content,
              id: 'mock-id',
              ownerId: 'something',
              title,
              tags,
              published: true,
              publishDate: Timestamp.now(),
            }}
          />
        </div>
      </div>
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
        onClick={() => onClick(getPost())}
        disabled={disabled}
      >
        <Text value="save" texts={texts} tag="text" />
      </Button>
    </div>
  );
};
