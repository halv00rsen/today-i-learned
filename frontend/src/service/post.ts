import { User } from '@firebase/auth';
import {
  collection,
  doc,
  DocumentSnapshot,
  setDoc,
  deleteDoc,
  where,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from '@firebase/firestore';
import {
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { isNonEmptyArray, NonEmptyArray } from '../utils/array';
import { PartialPost, StoredPost } from '../utils/types/domain';
import { saveTag, Tag } from './tag';

export const postsCollection = collection(firestore, 'post');

const mapToPost = (
  partialPost: Partial<StoredPost>,
  id: string
): StoredPost => {
  const {
    content,
    ownerId,
    subtitle,
    title,
    tags,
    published,
    publishDate,
  } = partialPost;
  if (
    content &&
    ownerId &&
    title &&
    tags &&
    publishDate &&
    published !== undefined
  ) {
    return {
      ...partialPost,
      id,
      content,
      ownerId,
      title,
      subtitle,
      tags,
      published,
      publishDate,
    };
  }
  throw new Error('Post missing data');
};

export const mapSnapshotToPosts = (
  document: DocumentSnapshot
): StoredPost => {
  const data = document.data();
  if (!data) {
    throw new Error('Data is undefined!');
  }
  const id = document.id;
  return mapToPost(data, id);
};

export const storePost = async (post: PartialPost, user: User) => {
  const data: Partial<StoredPost> = {
    ...post,
    ownerId: user.uid,
    publishDate: Timestamp.now(),
  };
  try {
    mapToPost(data, 'mockId');
  } catch {
    throw new Error(
      'Error while saving, could not build valid post'
    );
  }
  data.tags?.forEach((tag) => {
    saveTag(tag).catch();
  });
  return setDoc(doc(postsCollection), data);
};

export const deletePost = async (postId: string) => {
  const postRef = doc(postsCollection, postId);
  return await deleteDoc(postRef);
};

export const updatePost = async (
  postId: string,
  post: PartialPost
) => {
  const postRef = doc(postsCollection, postId);
  return await updateDoc(postRef, post);
};

export const getPost = async (
  postId: string
): Promise<StoredPost> => {
  const postRef = doc(postsCollection, postId);
  const snapshot = await getDoc(postRef);
  return mapSnapshotToPosts(snapshot);
};

export type PostData =
  | {
      type: 'EMPTY_POSTS';
    }
  | {
      type: 'VALID';
      data: PostsMachine;
    };

interface PostsMachine {
  status: 'LAST_POST_FOUND' | 'HAS_MORE_POSTS';
  posts: NonEmptyArray<StoredPost>;
  postViewIndex: number;
  lastQuerySnapshot: QueryDocumentSnapshot<DocumentData>;
  constraints: NonEmptyArray<QueryConstraint>;
}

export const LIMIT_POSTS = 2;

const getInitialPosts = async (
  constraints: NonEmptyArray<QueryConstraint>
): Promise<PostData> => {
  const data = await getDocs(
    query(postsCollection, ...[...constraints, limit(LIMIT_POSTS)])
  );
  const posts = data.docs.map(mapSnapshotToPosts);
  if (isNonEmptyArray(posts)) {
    return {
      type: 'VALID',
      data: {
        posts,
        lastQuerySnapshot: data.docs[data.docs.length - 1],
        postViewIndex: 0,
        status: 'HAS_MORE_POSTS',
        constraints,
      },
    };
  } else {
    return {
      type: 'EMPTY_POSTS',
    };
  }
};

const MAX_NUMBER_OF_TAGS = 10;

interface Config {
  tags?: NonEmptyArray<Tag>;
}

export const getInitialPublishedPosts = async ({
  tags,
}: Config = {}) => {
  const constraints: NonEmptyArray<QueryConstraint> = [
    where('published', '==', true),
    where('publishDate', '<=', Timestamp.now()),
  ];
  if (tags && tags.length <= MAX_NUMBER_OF_TAGS) {
    constraints.push(
      where(
        'tags',
        'array-contains-any',
        tags.map((tag) => tag.name)
      )
    );
  }
  return getInitialPosts([
    ...constraints,
    orderBy('publishDate', 'desc'),
  ]);
};

export const getInitialUserPosts = async ({
  published,
  userId,
}: {
  userId: string;
  published: boolean;
}) => {
  return getInitialPosts([
    where('ownerId', '==', userId),
    where('published', '==', published),
    orderBy('publishDate', 'desc'),
  ]);
};

type Direction = 'NEXT' | 'PREVIOUS';

export const shiftPostsWindow = async (
  postData: PostData,
  direction: Direction
): Promise<PostData> => {
  if (postData.type === 'EMPTY_POSTS') {
    return postData;
  }
  if (direction === 'PREVIOUS') {
    return {
      ...postData,
      data: {
        ...postData.data,
        postViewIndex: Math.max(
          0,
          postData.data.postViewIndex - LIMIT_POSTS
        ),
      },
    };
  } else {
    const newIndex = postData.data.postViewIndex + LIMIT_POSTS;
    if (newIndex < postData.data.posts.length) {
      return {
        ...postData,
        data: {
          ...postData.data,
          postViewIndex: newIndex,
        },
      };
    } else if (postData.data.status === 'LAST_POST_FOUND') {
      return {
        ...postData,
        data: {
          ...postData.data,
          postViewIndex: postData.data.posts.length - LIMIT_POSTS,
        },
      };
    }
    const snapshot = await getDocs(
      query(
        postsCollection,
        ...postData.data.constraints,
        startAfter(postData.data.lastQuerySnapshot),
        limit(LIMIT_POSTS)
      )
    );
    // todo docChanges
    const posts = snapshot.docs.map(mapSnapshotToPosts);
    if (isNonEmptyArray(posts)) {
      return {
        ...postData,
        data: {
          ...postData.data,
          lastQuerySnapshot:
            snapshot.docs[snapshot.docs.length - 1],
          postViewIndex: newIndex,
          posts: [...postData.data.posts, ...posts],
        },
      };
    } else {
      return {
        ...postData,
        data: {
          ...postData.data,
          status: 'LAST_POST_FOUND',
          postViewIndex: postData.data.posts.length - LIMIT_POSTS,
        },
      };
    }
  }
};
