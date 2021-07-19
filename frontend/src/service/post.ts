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
} from '@firebase/firestore';
import {
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { PartialPost, StoredPost } from '../utils/types/domain';

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

export const getPublishedPosts = async () => {
  const data = await getDocs(
    query(
      postsCollection,
      where('published', '==', true),
      where('publishDate', '<=', Timestamp.now()),
      orderBy('publishDate', 'desc'),
      limit(10)
    )
  );
  return data.docs.map(mapSnapshotToPosts);
};

export const getPostsByOwner = async (userId: string) => {
  const data = await getDocs(
    query(
      postsCollection,
      where('ownerId', '==', userId),
      orderBy('publishDate', 'desc')
    )
  );
  return data.docs.map(mapSnapshotToPosts);
};
