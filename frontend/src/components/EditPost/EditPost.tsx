import React, { useState } from 'react';
import { PartialPost } from '../../utils/types/domain';
import { Editor } from '../Editor/Editor';
import { Post } from '../Post/Post';
import styles from './EditPost.module.css';

interface Props {
  onClick: (post: PartialPost) => void;

  initialPost?: PartialPost;
  disabled?: boolean;
}

export const EditPost = ({
  onClick,
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
  });

  return (
    <div>
      <div className={styles.splitView}>
        <div>
          <h4>Legg til ny post</h4>
          <input
            type="text"
            disabled={disabled}
            value={title}
            placeholder="Tittel"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Editor
            disabled={disabled}
            onChange={setContent}
            initialValue={initialPost?.content}
          />
          <div>
            <div>Emneknagger</div>
            <ul>
              {tags.map((tag) => (
                <li key={tag}>
                  {tag}{' '}
                  <button onClick={() => removeTag(tag)}>
                    remove
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button onClick={addTag}>Legg til tag</button>
          </div>
        </div>
        <div>
          <h4>Forhåndsvisning av post</h4>
          <Post
            post={{
              content,
              id: 'mock-id',
              ownerId: 'something',
              title,
              tags,
            }}
          />
        </div>
      </div>
      <button
        onClick={() => onClick(getPost())}
        disabled={disabled}
      >
        Lagre post
      </button>
    </div>
  );
};
