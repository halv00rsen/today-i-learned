import React, { useCallback } from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getPostsByOwner } from '../service/post';

interface Props {
  userId: string;
}

export const UserPostsView = ({ userId }: Props) => {
  const getPosts = useCallback(() => {
    return getPostsByOwner(userId);
  }, [userId]);

  return (
    <div>
      <h3>Dine poster</h3>
      <PostsContainer getPosts={getPosts} />
    </div>
  );
};
