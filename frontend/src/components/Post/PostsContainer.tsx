import React, { useEffect, useState } from 'react';
import { Post } from './Post';
import { useUserStatus } from '../../utils/useUserStatus';
import { PostData, shiftPostsWindow } from '../../service/post';
import { InViewport } from '../InViewport';
import { Spinner } from '../Spinner/Spinner';

interface Props {
  getInitialPosts: () => Promise<PostData>;
}

type PostsStatus =
  | {
      type: 'LOADING';
    }
  | {
      type: 'ERROR';
    }
  | PostData;

export const PostsContainer = ({ getInitialPosts }: Props) => {
  const userStatus = useUserStatus();
  const [postStatus, setPostStatus] = useState<PostsStatus>({
    type: 'LOADING',
  });

  useEffect(() => {
    getInitialPosts()
      .then((status) => {
        setPostStatus(status);
      })
      .catch((err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      });
  }, [getInitialPosts]);

  const shiftPosts = (direction: 'NEXT' | 'PREVIOUS') => {
    if (postStatus.type !== 'VALID') {
      return;
    }
    shiftPostsWindow(postStatus, direction)
      .then((status) => {
        setPostStatus(status);
      })
      .catch((err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      });
  };

  if (postStatus.type === 'LOADING') {
    return <Spinner />;
  } else if (postStatus.type === 'ERROR') {
    return <div>En feil skjedde under lasting</div>;
  } else if (postStatus.type === 'EMPTY_POSTS') {
    return <div>Ingen poster funnet</div>;
  } else if (postStatus.type === 'VALID') {
    const { posts, status } = postStatus.data;
    return (
      <div>
        {posts.map((post) => {
          return (
            <Post
              key={post.id}
              post={post}
              deletable={userStatus.type === 'AUTHENTICATED'}
              editable={
                userStatus.type === 'AUTHENTICATED' &&
                userStatus.user.uid === post.ownerId
              }
            />
          );
        })}
        {status !== 'LAST_POST_FOUND' && (
          <InViewport
            onViewportEnter={() => {
              shiftPosts('NEXT');
            }}
          >
            <Spinner />
          </InViewport>
        )}
      </div>
    );
  } else {
    return null;
  }
};
