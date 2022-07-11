import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StoredPost } from '../../utils/types/domain';
import { Markdown } from '../Editor/Markdown';
import { Tag } from '../Tag/Tag';
import styles from './Post.module.css';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore/lite';
import { getFormattedDateWithTime } from '../../utils/time';
import { Button } from '../Button/Button';
import { Texts } from '../../utils/texts';
import { getInterpolatedText, getText } from '../Texts/Text';
import { useTextsPrefix } from '../../context/TextContext';
import { generatePostUrl } from '../../utils/router';
import { useMessageAlert } from '../Alert/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faClipboard,
  faClipboardQuestion,
} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  text: string;
  children?: React.ReactNode;
}

const Header = ({ children, text }: HeaderProps) => {
  return (
    <div className={styles.header} data-test-id="post-header">
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
  texts: Texts;
}

const Editable = ({ postId, status, texts }: EditableProps) => {
  const history = useHistory();

  const enterPost = () => {
    history.push({
      pathname: '/edit',
      search: `postId=${postId}`,
    });
  };

  return (
    <>
      {(status === 'all' || status === 'only-editable') && (
        <Button
          data-test-id="edit-post-button"
          inline={true}
          size="small"
          onClick={enterPost}
          title={getText({ texts, value: 'edit' })}
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      )}
    </>
  );
};

type CopyState = 'ok' | 'idle' | 'error';

const CopyStatus = ({ state }: { state: CopyState }) => {
  if (state === 'ok') {
    return (
      <FontAwesomeIcon
        icon={faClipboard}
        style={{ color: 'green' }}
      />
    );
  } else if (state === 'error') {
    return (
      <FontAwesomeIcon
        icon={faClipboardQuestion}
        style={{ color: 'red' }}
      />
    );
  }
  return <FontAwesomeIcon icon={faClipboard} />;
};

interface Props {
  post: StoredPost;
  editable?: boolean;
  deletable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Post = ({
  post,
  editable = false,
  deletable = false,
  className,
  style,
}: Props) => {
  const texts = useTextsPrefix('POST');

  const { showErrorMessage, showInfoMessage } = useMessageAlert();

  const [copyState, setCopyState] = useState<
    'ok' | 'idle' | 'error'
  >('idle');

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
      style={style}
      className={classNames(styles.post, className, {
        [styles.notPublished]: !post.published,
      })}
    >
      <Header text={post.title}>
        <div className={styles.buttonRow}>
          <Button
            inline
            title={getText({ texts, value: 'COPY_LINK' })}
            size="small"
            onClick={() => {
              setCopyState('idle');
              navigator.clipboard
                .writeText(generatePostUrl(post.id))
                .then(() => {
                  setCopyState('ok');
                  showInfoMessage(
                    getText({
                      texts,
                      value: 'COPY_LINK_SUCCESS',
                    })
                  );
                })
                .catch(() => {
                  setCopyState('error');
                  showErrorMessage(
                    getText({
                      texts,
                      value: 'COPY_LINK_ERROR',
                    })
                  );
                });
            }}
          >
            <CopyStatus state={copyState} />
          </Button>
          {getStatus() !== 'none' && (
            <Editable
              postId={post.id}
              status={getStatus()}
              texts={texts}
            />
          )}
        </div>
      </Header>
      <Content>
        {post.subtitle && <div>{post.subtitle}</div>}
        <Markdown content={post.content} />
      </Content>
      <Footer>
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <div className={styles.publishStatus}>
          {publishStatus === 'FUTURE_PUBLISH'
            ? getInterpolatedText({
                texts,
                value: 'FUTURE_PUBLISH_DATE',
                interpolate: [publishDate],
              })
            : publishStatus === 'PUBLISHED'
            ? `${publishDate}`
            : getText({
                texts,
                value: 'NOT_PUBLISHED',
              })}
        </div>
      </Footer>
    </div>
  );
};
