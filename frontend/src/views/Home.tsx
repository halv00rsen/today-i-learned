import { PostsContainer } from '../components/Post/PostsContainer';
import { SettingsRow } from '../components/Post/SettingsRow';
import { useTagProvider } from '../context/TagContext';
import { getInitialPublishedPosts } from '../service/post';

export const Home = () => {
  const { activeTags } = useTagProvider();
  return (
    <div>
      <SettingsRow />
      <PostsContainer
        getInitialPosts={() => {
          return getInitialPublishedPosts({
            tags: activeTags,
          });
        }}
      />
    </div>
  );
};
