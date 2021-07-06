export interface PartialPost {
  title: string;
  content: string;
  tags: string[];
  subtitle?: string;
}

export interface StoredPost {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  tags: string[];

  subtitle?: string;
}
