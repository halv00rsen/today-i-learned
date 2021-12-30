import {
  FirestoreError,
  FirestoreErrorCode,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useMessageAlert } from '../components/Alert/Alert';
import { Post } from '../components/Post/Post';
import { getText } from '../components/Texts/Text';
import { useTextsPrefix } from '../context/TextContext';
import { getPost } from '../service/post';
import { StoredPost } from '../utils/types/domain';

type PostStatus =
  | {
      status: 'empty';
    }
  | {
      status: 'fetching';
    }
  | {
      status: 'error';
      error?: FirestoreErrorCode;
    }
  | {
      status: 'fetched';
      post: StoredPost;
    };

export const PostView = () => {
  const { postId } = useParams<{ postId: string }>();
  const [postStatus, setStatus] = useState<PostStatus>({
    status: 'empty',
  });
  const texts = useTextsPrefix('POST');
  const { showErrorMessage } = useMessageAlert();

  const { status } = postStatus;

  const errorText = getText({
    texts,
    value: 'NOT_FOUND_ALERT',
  });

  useEffect(() => {
    if (status === 'empty') {
      setStatus({ status: 'fetching' });
      getPost(postId)
        .then((post) => {
          setStatus({
            status: 'fetched',
            post,
          });
        })
        .catch((err: FirestoreError) => {
          console.log(err);
          setStatus({
            status: 'error',
            error: err.code,
          });
          showErrorMessage(errorText);
        });
    }
  }, [postId, status, showErrorMessage, errorText]);

  if (status === 'error') {
    return <Redirect to="/" />;
  } else if (status === 'fetching' || status === 'empty') {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Post post={postStatus.post} />
    </div>
  );
};
