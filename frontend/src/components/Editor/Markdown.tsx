import ReactMarkdown, { Components } from 'react-markdown';
import { lazy, Suspense } from 'react';
import classNames from 'classnames';
import styles from './Markdown.module.css';

const CodeSyntax = lazy(() =>
  import('./CodeSyntax').then((module) => ({
    default: module.CodeSyntax,
  }))
);

const components: Components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const stringChildren = String(children).replace(/\n$/, '');
    const language = match?.[1];

    const DefaultCodeBlock = () => (
      <code
        className={classNames(
          className,
          styles.code,
          styles.nativeCodeBlock
        )}
        {...props}
      >
        {children}
      </code>
    );

    return !inline && language ? (
      <Suspense fallback={<DefaultCodeBlock />}>
        <CodeSyntax language={language} code={stringChildren} />
      </Suspense>
    ) : (
      <DefaultCodeBlock />
    );
  },
};

interface Props {
  content: string;
}

export const Markdown = ({ content }: Props) => {
  return (
    <ReactMarkdown components={components}>
      {content}
    </ReactMarkdown>
  );
};
