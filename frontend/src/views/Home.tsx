import React from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getInitialPublishedPosts } from '../service/post';

export const Home = () => {
  return (
    <div>
      <PostsContainer getInitialPosts={getInitialPublishedPosts} />
    </div>
  );
};
