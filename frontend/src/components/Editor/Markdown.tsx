import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown, { Components } from 'react-markdown';
import styles from './Markdown.module.css';

const components: Components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const stringChildren = String(children).replace(/\n$/, '');

    return !inline && match ? (
      <SyntaxHighlighter
        style={atomOneDark}
        language={match[1]}
        PreTag="div"
        codeTagProps={{ className: styles.code }}
      >
        {stringChildren}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
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
