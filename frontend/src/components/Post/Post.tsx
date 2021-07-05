import React from 'react';
import { StoredPost } from '../../utils/types/domain';
import { Markdown } from '../Editor/Markdown';
import styles from './Post.module.css';

interface Props {
  post: StoredPost;
  displayEdit?: boolean;
}

export const Post = ({ post, displayEdit = false }: Props) => {
  return (
    <div className={styles.post}>
      <h3>{post.title}</h3>
      {displayEdit && <button>Endre</button>}
      {post.subtitle && <div>{post.subtitle}</div>}
      <Markdown content={post.content} />
    </div>
  );
};
