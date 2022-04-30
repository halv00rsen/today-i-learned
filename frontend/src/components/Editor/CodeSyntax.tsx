import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './Markdown.module.css';

interface Props {
  language: string;
  code: string;
}

export const CodeSyntax = ({ language, code }: Props) => {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      codeTagProps={{ className: styles.code }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
