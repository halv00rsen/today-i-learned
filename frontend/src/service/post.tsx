import { User } from '@firebase/auth';
import {
  collection,
  doc,
  QueryDocumentSnapshot,
  setDoc,
} from '@firebase/firestore';
import { firestore } from '../firebase';
import { PartialPost, StoredPost } from '../utils/types/domain';

export const postsCollection = collection(firestore, 'post');

const mapToPost = (
  partialPost: Partial<StoredPost>,
  id: string
): StoredPost => {
  const { content, ownerId, subtitle, title } = partialPost;
  if (content && ownerId && title) {
    return {
      id,
      content,
      ownerId,
      title,
      subtitle,
    };
  }
  throw new Error('Post missing data');
};

export const mapSnapshotToPosts = (
  document: QueryDocumentSnapshot
): StoredPost => {
  const data = document.data();
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
