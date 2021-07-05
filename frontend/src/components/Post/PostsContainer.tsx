import React, { useEffect, useState } from 'react';
import { query, onSnapshot } from 'firebase/firestore';
import { StoredPost } from '../../utils/types/domain';
import { Post } from './Post';
import {
  mapSnapshotToPosts,
  postsCollection,
} from '../../service/post';
import { useUserStatus } from '../../utils/useUserStatus';

type PostsStatus =
  | {
      type: 'LOADING';
    }
  | {
      type: 'ERROR';
    }
  | {
      type: 'LOADED';
      posts: StoredPost[];
    };

export const PostsContainer = () => {
  const userStatus = useUserStatus();
  const [postStatus, setPostStatus] = useState<PostsStatus>({
    type: 'LOADING',
  });

  useEffect(() => {
    const allPosts = query(postsCollection);
    const unsubscribe = onSnapshot(
      allPosts,
      (snapshot) => {
        try {
          const posts = snapshot.docs.map(mapSnapshotToPosts);
          setPostStatus({ type: 'LOADED', posts });
        } catch {
          setPostStatus({ type: 'ERROR' });
        }
      },
      (err) => {
        console.log(err);
        setPostStatus({ type: 'ERROR' });
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  if (postStatus.type === 'LOADING') {
    return <div>Laster poster...</div>;
  } else if (postStatus.type === 'ERROR') {
    return <div>En feil skjedde under lasting</div>;
  } else if (postStatus.type === 'LOADED') {
    return (
      <div>
        {postStatus.posts.map((post) => {
          return (
            <Post
              key={post.id}
              post={post}
              displayEdit={
                userStatus.type === 'AUTHENTICATED' &&
                userStatus.user.uid === post.ownerId
              }
            />
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};
