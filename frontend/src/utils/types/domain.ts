import { Timestamp } from 'firebase/firestore/lite';
import { Language } from '../texts';

export interface PartialPost {
  title: string;
  content: string;
  tags: string[];
  published: boolean;
  language?: Language;
}

export interface StoredPost {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  tags: string[];
  published: boolean;
  publishDate: Timestamp;
  language?: Language;
}
