import React, { useEffect, useState } from 'react';
import { StoredPost } from '../../utils/types/domain';
import { Post } from './Post';
import { useUserStatus } from '../../utils/useUserStatus';

interface Props {
  getPosts: () => Promise<StoredPost[]>;
}

type PostsStatus =
  | {
      type: 'LOADING';
    }
  | {
      type: 'ERROR';
    }
  | {
      type: 'LOADED';
      posts: StoredPost[];
    };

export const PostsContainer = ({ getPosts }: Props) => {
  const userStatus = useUserStatus();
  const [postStatus, setPostStatus] = useState<PostsStatus>({
    type: 'LOADING',
  });

  useEffect(() => {
    getPosts()
      .then((posts) => {
        setPostStatus({ type: 'LOADED', posts });
      })
      .catch((err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      });
  }, [getPosts]);

  if (postStatus.type === 'LOADING') {
    return <div>Laster poster...</div>;
  } else if (postStatus.type === 'ERROR') {
    return <div>En feil skjedde under lasting</div>;
  } else if (postStatus.type === 'LOADED') {
    return (
      <div>
        {postStatus.posts.map((post) => {
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
      </div>
    );
  } else {
    return null;
  }
};
