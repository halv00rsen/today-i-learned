import { useState } from 'react';
import { Textarea } from '../Textarea/Textarea';
import styles from './Editor.module.css';

interface Props {
  onChange?: (content: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

export const Editor = ({
  onChange,
  disabled = false,
  initialValue,
}: Props) => {
  const [markdown, setMarkdown] = useState(initialValue ?? '');

  const updateContent = (content: string) => {
    setMarkdown(content);
    onChange?.(content);
  };

  return (
    <div className={styles.editor}>
      <Textarea
        data-test-id="editor"
        className={styles.textarea}
        disabled={disabled}
        value={markdown}
        onChange={(e) => updateContent(e.target.value)}
      />
    </div>
  );
};
