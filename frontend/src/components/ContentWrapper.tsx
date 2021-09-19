import React from 'react';
import styles from './ContentWrapper.module.css';

interface Props {
  children: React.ReactNode;
}

export const ContentWrapper = ({ children }: Props) => {
  return <div className={styles.content}>{children}</div>;
};
