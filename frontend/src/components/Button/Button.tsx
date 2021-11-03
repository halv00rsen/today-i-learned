import classNames from 'classnames';
import styles from './Button.module.css';

type ButtonProps = JSX.IntrinsicElements['button'];

type Size = 'small' | 'medium' | 'large';

interface Props extends ButtonProps {
  inline?: boolean;
  center?: boolean;
  size?: Size;
}

export const Button = ({
  size = 'small',
  children,
  center = false,
  inline = false,
  className,
  ...rest
}: Props) => {
  return (
    <button
      {...rest}
      className={classNames(
        styles.button,
        styles[size],
        className,
        {
          [styles.center]: center,
          [styles.inline]: inline,
        }
      )}
    >
      {children}
    </button>
  );
};
