import classNames from 'classnames';
import styles from './Input.module.css';

type InputProps = JSX.IntrinsicElements['input'];

export const Input = ({ className, ...rest }: InputProps) => {
  return (
    <input
      className={classNames(className, styles.input)}
      {...rest}
    />
  );
};
