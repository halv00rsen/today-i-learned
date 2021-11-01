import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { EditPost } from '../components/EditPost/EditPost';
import { getPost, updatePost } from '../service/post';
import { useQueryParams } from '../utils/router';
import { StoredPost } from '../utils/types/domain';
import {
  FirestoreError,
  FirestoreErrorCode,
} from 'firebase/firestore';
import { getFirestoreError } from '../utils/error';

type EditState =
  | { type: 'empty' }
  | { type: 'fetching' }
  | { type: 'loaded'; post: StoredPost }
  | { type: 'updating'; post: StoredPost }
  | { type: 'error'; firestoreErrorCode: FirestoreErrorCode };

export const EditView = () => {
  const { postId } = useQueryParams('postId');
  const [editStatus, setEditStatus] = useState<EditState>({
    type: 'empty',
  });

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
        <h4>Endre posten</h4>
        <EditPost
          initialPost={editStatus.post}
          disabled={editStatus.type === 'updating'}
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
