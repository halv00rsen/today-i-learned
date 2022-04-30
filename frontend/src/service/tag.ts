import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  setDoc,
} from 'firebase/firestore/lite';
import { firestore } from '../firebase';

export interface Tag {
  id: string;
  name: string;
}

const tagCollection = collection(firestore, 'tag');

const partialTagToTag = (
  partialTag: Partial<Tag>,
  id: string
): Tag => {
  if (partialTag.name) {
    return {
      id,
      name: partialTag.name,
    };
  }
  throw new Error(`Missing data for tag: ${id}`);
};

const snapshotToTag = (document: DocumentSnapshot): Tag => {
  const data = document.data();
  if (!data) {
    throw new Error('Could not find data for tag');
  }
  return partialTagToTag(data, document.id);
};

export const getTags = async () => {
  const snapshot = await getDocs(tagCollection);
  return snapshot.docs.map(snapshotToTag);
};

const tagExists = async (tag: Tag): Promise<boolean> => {
  return !!(await getTags()).find((t) => t.name === tag.name);
};

export const saveTag = async (tagName: string) => {
  if (
    !(await tagExists(
      partialTagToTag({ name: tagName }, 'fake-id')
    ))
  ) {
    return setDoc(doc(tagCollection), { name: tagName });
  }
};
