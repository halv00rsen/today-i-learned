import React, { useState } from 'react';
import styles from './Editor.module.css';

interface Props {
  onChange?: (content: string) => void;
  disabled?: boolean;
}

export const Editor = ({ onChange, disabled = false }: Props) => {
  const [markdown, setMarkdown] = useState('');

  const updateContent = (content: string) => {
    setMarkdown(content);
    onChange?.(content);
  };

  return (
    <div className={styles.editor}>
      <textarea
        disabled={disabled}
        value={markdown}
        onChange={(e) => updateContent(e.target.value)}
      />
    </div>
  );
};
