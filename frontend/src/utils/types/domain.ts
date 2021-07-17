export interface PartialPost {
  title: string;
  content: string;
  tags: string[];
  published: boolean;
  subtitle?: string;
}

export interface StoredPost {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  tags: string[];
  published: boolean;

  subtitle?: string;
}
