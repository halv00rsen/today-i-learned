import React from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';

export const Home = () => {
  return (
    <div>
      <h3>En helt vanlig fyr</h3>
      <h4>I dag har jeg lært</h4>
      <PostsContainer />
    </div>
  );
};
