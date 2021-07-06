import React, { useState } from 'react';
import { User } from '@firebase/auth';
import { storePost } from '../service/post';
import { Editor } from '../components/Editor/Editor';
import { Post } from '../components/Post/Post';
import { Redirect } from 'react-router';
import styles from './AddPostView.module.css';

interface Props {
  user: User;
}

type AddingStatus = 'CREATING' | 'CREATED' | 'ERROR' | 'INIT';

export const AddPostView = ({ user }: Props) => {
  const [status, setStatus] = useState<AddingStatus>('INIT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

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

  const addPost = () => {
    setStatus('CREATING');
    storePost(
      {
        content,
        title,
        tags,
      },
      user
    )
      .then(() => {
        setStatus('CREATED');
      })
      .catch(() => {
        setStatus('ERROR');
      });
  };

  if (status === 'CREATED') {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {status === 'ERROR' && <div>En feil skjedde</div>}
      <div className={styles.splitView}>
        <div>
          <h4>Legg til ny post</h4>
          <input
            type="text"
            disabled={status === 'CREATING'}
            value={title}
            placeholder="Tittel"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Editor
            disabled={status === 'CREATING'}
            onChange={setContent}
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
      <button onClick={addPost} disabled={status === 'CREATING'}>
        Lagre post
      </button>
    </div>
  );
};
