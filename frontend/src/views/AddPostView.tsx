import { useState } from 'react';
import { User } from '@firebase/auth';
import { storePost } from '../service/post';
import { Redirect, useHistory } from 'react-router';
import { EditPost } from '../components/EditPost/EditPost';
import { PartialPost } from '../utils/types/domain';
import { FirestoreError } from 'firebase/firestore';
import { getFirestoreError } from '../utils/error';
import { useTextsPrefix } from '../context/TextContext';
import { Text } from '../components/Texts/Text';

interface Props {
  user: User;
}

type AddingStatus = 'CREATING' | 'CREATED' | 'ERROR' | 'INIT';

export const AddPostView = ({ user }: Props) => {
  const [status, setStatus] = useState<AddingStatus>('INIT');

  const texts = useTextsPrefix('NEWPOST');
  const history = useHistory();

  const addPost = (post: PartialPost) => {
    setStatus('CREATING');
    storePost(post, user)
      .then(() => {
        setStatus('CREATED');
      })
      .catch((err: FirestoreError) => {
        setStatus('ERROR');
        console.log(getFirestoreError(err.code));
      });
  };

  if (status === 'CREATED') {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {status === 'ERROR' && (
        <Text value="SHARED.ERROR" texts={texts} tag="div" />
      )}
      <EditPost
        onRemove={() => history.push('/')}
        onClick={addPost}
        disabled={status === 'CREATING'}
        texts={texts}
      />
    </div>
  );
};
