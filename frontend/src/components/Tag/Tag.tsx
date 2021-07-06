import React from 'react';
import styles from './Tag.module.css';

interface Props {
  tag: string;
}

export const Tag = ({ tag }: Props) => {
  return <div className={styles.tag}>{tag}</div>;
};
