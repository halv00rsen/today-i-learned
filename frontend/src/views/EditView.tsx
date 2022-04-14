import { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { EditPost } from '../components/EditPost/EditPost';
import { deletePost, getPost, updatePost } from '../service/post';
import { useQueryParams } from '../utils/router';
import { StoredPost } from '../utils/types/domain';
import {
  FirestoreError,
  FirestoreErrorCode,
} from 'firebase/firestore';
import { getFirestoreError } from '../utils/error';
import { useTextsPrefix } from '../context/TextContext';
import { useMessageAlert } from '../components/Alert/Alert';
import { getText } from '../components/Texts/Text';

type EditState =
  | { type: 'empty' }
  | { type: 'fetching' }
  | { type: 'loaded'; post: StoredPost }
  | { type: 'updating'; post: StoredPost }
  | { type: 'error'; firestoreErrorCode: FirestoreErrorCode };

export const EditView = () => {
  const texts = useTextsPrefix('NEWPOST');
  const { postId } = useQueryParams('postId');
  const [editStatus, setEditStatus] = useState<EditState>({
    type: 'empty',
  });
  const history = useHistory();
  const { showErrorMessage, showInfoMessage } = useMessageAlert();

  useEffect(() => {
    if (!postId) {
      return;
    }
    if (editStatus.type === 'empty') {
      setEditStatus({
        type: 'fetching',
      });
      getPost(postId)
        .then((post) => {
          setEditStatus({
            type: 'loaded',
            post,
          });
        })
        .catch((err: FirestoreError) => {
          setEditStatus({
            type: 'error',
            firestoreErrorCode: err.code,
          });
        });
    }
  }, [editStatus, postId]);

  if (postId === null) {
    return <Redirect to="/" />;
  }

  if (editStatus.type === 'fetching') {
    return <div>Laster post</div>;
  } else if (
    editStatus.type === 'loaded' ||
    editStatus.type === 'updating'
  ) {
    return (
      <div>
        <EditPost
          texts={texts}
          initialPost={editStatus.post}
          disabled={editStatus.type === 'updating'}
          onRemove={() => {
            deletePost(postId)
              .then(() => {
                showInfoMessage(
                  getText({ texts, value: 'delete.success' })
                );
                history.push('/');
              })
              .catch(() => {
                showErrorMessage(
                  getText({ texts, value: 'delete.error' })
                );
              });
          }}
          onClick={(post) => {
            setEditStatus({
              type: 'updating',
              post: {
                ...editStatus.post,
                ...post,
              },
            });
            updatePost(postId, post)
              .then(() => {
                setEditStatus({
                  type: 'loaded',
                  post: editStatus.post,
                });
              })
              .catch((err: FirestoreError) => {
                setEditStatus({
                  type: 'error',
                  firestoreErrorCode: err.code,
                });
              });
          }}
        />
      </div>
    );
  } else if (editStatus.type === 'error') {
    return (
      <div>
        <div>En feil skjedde</div>
        {getFirestoreError(editStatus.firestoreErrorCode)}
      </div>
    );
  }
  return null;
};
