import React from 'react';
import { Link } from 'react-router-dom';
import { deletePost } from '../../service/post';
import { StoredPost } from '../../utils/types/domain';
import { Markdown } from '../Editor/Markdown';
import { Tag } from '../Tag/Tag';
import styles from './Post.module.css';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import { getFormattedDateWithTime } from '../../utils/time';

interface HeaderProps {
  text: string;
  children?: React.ReactNode;
}

const Header = ({ children, text }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>{text}</div>
      <div className={styles.headerRight}>{children}</div>
    </div>
  );
};

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return <div className={styles.content}>{children}</div>;
};

interface FooterProps {
  children: React.ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  return <div className={styles.footer}>{children}</div>;
};

type PublishStatus =
  | 'NOT_PUBLISHED'
  | 'PUBLISHED'
  | 'FUTURE_PUBLISH';

const getPublishStatus = ({
  published,
  publishDate,
}: {
  published: boolean;
  publishDate: Timestamp;
}): PublishStatus => {
  if (!published) {
    return 'NOT_PUBLISHED';
  } else if (publishDate > Timestamp.now()) {
    return 'FUTURE_PUBLISH';
  } else {
    return 'PUBLISHED';
  }
};

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
  const publishStatus = getPublishStatus({
    published: post.published,
    publishDate: post.publishDate,
  });
  const publishDate = getFormattedDateWithTime(
    post.publishDate.toDate()
  );
  return (
    <div
      className={classNames(styles.post, {
        [styles.notPublished]: !post.published,
      })}
    >
      <Header text={post.title}>
        {getStatus() !== 'none' && (
          <Editable postId={post.id} status={getStatus()} />
        )}
      </Header>
      <Content>
        {post.subtitle && <div>{post.subtitle}</div>}
        <Markdown content={post.content} />
      </Content>
      <Footer>
        <div>
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <div className={styles.publishStatus}>
          {publishStatus === 'FUTURE_PUBLISH'
            ? `Publiseres på ${publishDate}`
            : publishStatus === 'PUBLISHED'
            ? `${publishDate}`
            : `Ikke publisert`}
        </div>
      </Footer>
    </div>
  );
};
