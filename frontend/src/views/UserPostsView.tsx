import React, { useCallback } from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { getInitialUserPosts } from '../service/post';

interface Props {
  userId: string;
}

export const UserPostsView = ({ userId }: Props) => {
  const publishedPosts = useCallback(() => {
    return getInitialUserPosts({ published: true, userId });
  }, [userId]);

  const unpublishedPosts = useCallback(() => {
    return getInitialUserPosts({ published: false, userId });
  }, [userId]);

  return (
    <div>
      <h3>Upubliserte poster</h3>
      <PostsContainer
        getInitialPosts={unpublishedPosts}
        noPostsFoundText="Du har ingen upubliserte poster"
        ignoreLastPostMessage
      />
      <h3>Mine poster</h3>
      <PostsContainer getInitialPosts={publishedPosts} />
    </div>
  );
};
