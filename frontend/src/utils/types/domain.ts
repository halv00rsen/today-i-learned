export interface PartialPost {
  title: string;
  content: string;
  subtitle?: string;
}

export interface StoredPost {
  id: string;
  title: string;
  content: string;
  ownerId: string;

  subtitle?: string;
}
