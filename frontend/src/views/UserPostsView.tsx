import { useCallback } from 'react';
import { PostsContainer } from '../components/Post/PostsContainer';
import { Text } from '../components/Texts/Text';
import { useTextsPrefix } from '../context/TextContext';
import { getInitialUserPosts } from '../service/post';

interface Props {
  userId: string;
}

export const UserPostsView = ({ userId }: Props) => {
  const texts = useTextsPrefix('USERPOST');

  const publishedPosts = useCallback(() => {
    return getInitialUserPosts({ published: true, userId });
  }, [userId]);

  const unpublishedPosts = useCallback(() => {
    return getInitialUserPosts({ published: false, userId });
  }, [userId]);

  return (
    <div>
      <Text value="UNPUBLISHED" texts={texts} tag="h3" />
      <PostsContainer
        getInitialPosts={unpublishedPosts}
        noPostsFoundText="Du har ingen upubliserte poster"
        ignoreLastPostMessage
      />
      <Text value="PUBLISHED" texts={texts} tag="h3" />
      <PostsContainer getInitialPosts={publishedPosts} />
    </div>
  );
};
