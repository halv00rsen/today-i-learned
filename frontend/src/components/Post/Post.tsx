import React from 'react';
import { useHistory } from 'react-router-dom';
import { deletePost } from '../../service/post';
import { StoredPost } from '../../utils/types/domain';
import { Markdown } from '../Editor/Markdown';
import { Tag } from '../Tag/Tag';
import styles from './Post.module.css';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import { getFormattedDateWithTime } from '../../utils/time';
import { Button } from '../Button/Button';
import { Texts } from '../../utils/texts';
import { getInterpolatedText, getText, Text } from '../Texts/Text';
import { useTextsPrefix } from '../../context/TextContext';
import { generatePostUrl } from '../../utils/router';
import { useMessageAlert } from '../Alert/Alert';

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
        <Button inline={true} size="small" onClick={enterPost}>
          <Text value="edit" texts={texts} tag="text" />
        </Button>
      )}
      {(status === 'all' || status === 'only-delete') && (
        <Button
          data-test-id="delete-post-button"
          inline={true}
          size="small"
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
          <Text value="delete" texts={texts} tag="text" />
        </Button>
      )}
    </>
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
  const texts = useTextsPrefix('POST');

  const { showErrorMessage, showInfoMessage } = useMessageAlert();

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
        <div className={styles.buttonRow}>
          {getStatus() !== 'none' && (
            <Editable
              postId={post.id}
              status={getStatus()}
              texts={texts}
            />
          )}
          <Button
            inline
            size="small"
            onClick={() => {
              navigator.clipboard
                .writeText(generatePostUrl(post.id))
                .then(() => {
                  showInfoMessage(
                    'Lenken ble kopiert til utklippstavlen'
                  );
                })
                .catch(() => {
                  showErrorMessage('Klarte ikke kopiere lenken');
                });
            }}
          >
            <Text value="COPY_LINK" texts={texts} />
          </Button>
        </div>
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
