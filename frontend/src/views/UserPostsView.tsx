import React, { useCallback } from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getInitialUserPosts } from '../service/post';

interface Props {
  userId: string;
}

export const UserPostsView = ({ userId }: Props) => {
  const getPosts = useCallback(() => {
    return getInitialUserPosts(userId);
  }, [userId]);

  return (
    <div>
      <h3>Mine poster</h3>
      <PostsContainer getInitialPosts={getPosts} />
    </div>
  );
};
