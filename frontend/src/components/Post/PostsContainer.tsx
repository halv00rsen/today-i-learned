import React, { useEffect, useState } from 'react';
import { Post } from './Post';
import { useUserStatus } from '../../utils/useUserStatus';
import {
  LIMIT_POSTS,
  PostData,
  shiftPostsWindow,
} from '../../service/post';

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
    setPostStatus({ type: 'LOADING' });
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
    return <div>Laster poster...</div>;
  } else if (postStatus.type === 'ERROR') {
    return <div>En feil skjedde under lasting</div>;
  } else if (postStatus.type === 'EMPTY_POSTS') {
    return <div>Ingen poster funnet</div>;
  } else if (postStatus.type === 'VALID') {
    const { postViewIndex, posts, status } = postStatus.data;
    const endIndex = postViewIndex + LIMIT_POSTS;
    return (
      <div>
        {posts.slice(postViewIndex, endIndex).map((post) => {
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
        <button
          disabled={postViewIndex === 0}
          onClick={() => shiftPosts('PREVIOUS')}
        >
          Forrige
        </button>
        <button
          disabled={
            endIndex >= posts.length &&
            status === 'LAST_POST_FOUND'
          }
          onClick={() => shiftPosts('NEXT')}
        >
          Neste
        </button>
      </div>
    );
  } else {
    return null;
  }
};
