import React, { useState } from 'react';
import { User } from '@firebase/auth';
import { storePost } from '../service/post';
import { Editor } from '../components/Editor/Editor';
import { Post } from '../components/Post/Post';
import { Redirect } from 'react-router';

interface Props {
  user: User;
}

type AddingStatus = 'CREATING' | 'CREATED' | 'ERROR' | 'INIT';

export const AddPostView = ({ user }: Props) => {
  const [status, setStatus] = useState<AddingStatus>('INIT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addPost = () => {
    setStatus('CREATING');
    storePost(
      {
        content,
        title,
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
      <div>Legg til ny post</div>
      {status === 'ERROR' && <div>En feil skjedde</div>}
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
      <Post
        post={{
          content,
          id: 'mock-id',
          ownerId: 'something',
          title,
        }}
      />
      <button onClick={addPost} disabled={status === 'CREATING'}>
        Lagre post
      </button>
    </div>
  );
};
