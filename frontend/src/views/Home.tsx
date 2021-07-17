import React from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getPublishedPosts } from '../service/post';

export const Home = () => {
  return (
    <div>
      <h3>En helt vanlig fyr</h3>
      <h4>I dag har jeg lært</h4>
      <PostsContainer getPosts={getPublishedPosts} />
    </div>
  );
};
