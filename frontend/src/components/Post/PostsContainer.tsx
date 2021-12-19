import { useEffect, useState } from 'react';
import { Post } from './Post';
import { useUserStatus } from '../../utils/useUserStatus';
import { PostData, shiftPostsWindow } from '../../service/post';
import { InViewport } from '../InViewport';
import { Spinner } from '../Spinner/Spinner';
import styles from './PostsContainer.module.css';
import { Text } from '../Texts/Text';
import { useTextsPrefix } from '../../context/TextContext';

interface Props {
  getInitialPosts: () => Promise<PostData>;

  noPostsFoundText?: string;
  ignoreLastPostMessage?: boolean;
}

type PostsStatus =
  | {
      type: 'LOADING';
    }
  | {
      type: 'ERROR';
    }
  | PostData;

export const PostsContainer = ({
  getInitialPosts,
  noPostsFoundText = 'Ingen poster funnet',
  ignoreLastPostMessage = false,
}: Props) => {
  const texts = useTextsPrefix('POSTS');
  const userStatus = useUserStatus();
  const [postStatus, setPostStatus] = useState<PostsStatus>({
    type: 'LOADING',
  });

  useEffect(() => {
    getInitialPosts()
      .then((status) => {
        setPostStatus(status);
      })
      .catch((err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      });
  }, [getInitialPosts]);

  const shiftPosts = (direction: 'NEXT' | 'PREVIOUS') => {
    if (postStatus.type !== 'VALID') {
      return;
    }
    shiftPostsWindow(postStatus, direction)
      .then((status) => {
        setPostStatus(status);
      })
      .catch((err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      });
  };

  if (postStatus.type === 'LOADING') {
    return <Spinner />;
  } else if (postStatus.type === 'ERROR') {
    return <Text value="error" texts={texts} />;
  } else if (postStatus.type === 'EMPTY_POSTS') {
    return <div>{noPostsFoundText}</div>;
  } else if (postStatus.type === 'VALID') {
    const { posts, status } = postStatus.data;
    return (
      <div>
        {posts.map((post) => {
          return (
            <Post
              key={post.id}
              post={post}
              deletable={
                userStatus.type === 'AUTHENTICATED' &&
                userStatus.roles.includes('admin')
              }
              editable={
                userStatus.type === 'AUTHENTICATED' &&
                userStatus.user.uid === post.ownerId
              }
            />
          );
        })}
        {status !== 'LAST_POST_FOUND' && (
          <InViewport
            onViewportEnter={() => {
              shiftPosts('NEXT');
            }}
          >
            <Spinner />
          </InViewport>
        )}
        {!ignoreLastPostMessage && status === 'LAST_POST_FOUND' && (
          <div className={styles.lastPostFound}>
            <Text value="LAST" texts={texts} tag="i" />
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};
