import classNames from 'classnames';
import React from 'react';
import styles from './Checkbox.module.css';

type InputProps = JSX.IntrinsicElements['input'];

interface Props {
  label: string;
}

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  InputProps & Props
>(function Input({ label, ...rest }, ref) {
  return (
    <label className={styles.formControl}>
      <input
        ref={ref}
        {...rest}
        className={classNames(styles.checkbox, rest.className)}
        type="checkbox"
      />
      {label}
    </label>
  );
});
