interface User {
  email: string;
  password: string;
  roles: string[];
}

export const adminUser: User = {
  email: 'admin@admin.admin',
  password: 'passord',
  roles: ['admin'],
};

export const regularUser: User = {
  email: 'test@test.test',
  password: 'passord',
  roles: [],
};

interface Post {
  title: string;
  content: string;
  tags: string[];
  publish: boolean;
}

const content = `
Here we have content.

~~~ts
interface Props {
  title: string;
}
~~~

With code.
`;
export const newPost: Post = {
  title: 'New post title',
  content,
  publish: true,
  tags: ['code'],
};
