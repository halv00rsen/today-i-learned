import React from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getPublishedPosts } from '../service/post';

export const Home = () => {
  return (
    <div>
      <PostsContainer getPosts={getPublishedPosts} />
    </div>
  );
};
