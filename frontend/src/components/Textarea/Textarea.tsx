import classNames from 'classnames';
import React from 'react';
import styles from './Textarea.module.css';

type Props = JSX.IntrinsicElements['textarea'];

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  Props
>(function Textarea({ ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      {...rest}
      className={classNames(rest.className, styles.textarea)}
    />
  );
});
