import React from 'react';
import { Link } from 'react-router-dom';
import { deletePost } from '../../service/post';
import { StoredPost } from '../../utils/types/domain';
import { Markdown } from '../Editor/Markdown';
import { Tag } from '../Tag/Tag';
import styles from './Post.module.css';

type EditableStatus =
  | 'all'
  | 'only-delete'
  | 'only-editable'
  | 'none';

interface EditableProps {
  postId: string;
  status: EditableStatus;
}

const Editable = ({ postId, status }: EditableProps) => {
  return (
    <div>
      {(status === 'all' || status === 'only-editable') && (
        <Link
          to={{
            pathname: '/edit',
            search: `postId=${postId}`,
          }}
        >
          Endre
        </Link>
      )}
      {(status === 'all' || status === 'only-delete') && (
        <button
          onClick={() =>
            deletePost(postId)
              .then((e) => {
                console.log('success');
                console.log(e);
              })
              .catch((e) => {
                console.log('error');
                console.log(e);
              })
          }
        >
          Slett
        </button>
      )}
    </div>
  );
};

interface Props {
  post: StoredPost;
  editable?: boolean;
  deletable?: boolean;
}

export const Post = ({
  post,
  editable = false,
  deletable = false,
}: Props) => {
  const getStatus = (): EditableStatus => {
    if (editable && deletable) {
      return 'all';
    } else if (editable) {
      return 'only-editable';
    } else if (deletable) {
      return 'only-delete';
    } else {
      return 'none';
    }
  };
  return (
    <div className={styles.post}>
      <h3>{post.title}</h3>
      {getStatus() !== 'none' && (
        <Editable postId={post.id} status={getStatus()} />
      )}
      {post.subtitle && <div>{post.subtitle}</div>}
      <Markdown content={post.content} />

      {post.tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};
