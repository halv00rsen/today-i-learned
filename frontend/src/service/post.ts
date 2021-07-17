import { User } from '@firebase/auth';
import {
  collection,
  doc,
  DocumentSnapshot,
  setDoc,
  deleteDoc,
} from '@firebase/firestore';
import { getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { PartialPost, StoredPost } from '../utils/types/domain';

export const postsCollection = collection(firestore, 'post');

const mapToPost = (
  partialPost: Partial<StoredPost>,
  id: string
): StoredPost => {
  const { content, ownerId, subtitle, title, tags } = partialPost;
  if (content && ownerId && title && tags) {
    return {
      id,
      content,
      ownerId,
      title,
      subtitle,
      tags,
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
  const data = {
    ...post,
    ownerId: user.uid,
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
