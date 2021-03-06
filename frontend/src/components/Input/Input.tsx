import classNames from 'classnames';
import React from 'react';
import styles from './Input.module.css';

type InputProps = JSX.IntrinsicElements['input'];

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(function Input({ ...rest }, ref) {
  return (
    <input
      ref={ref}
      {...rest}
      className={classNames(styles.input, rest.className)}
    />
  );
});
