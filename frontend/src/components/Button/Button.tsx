import classNames from 'classnames';
import styles from './Button.module.css';

type ButtonProps = JSX.IntrinsicElements['button'];

type Size = 'small' | 'medium' | 'large';

interface Props extends ButtonProps {
  fullWidth?: boolean;
  inline?: boolean;
  center?: boolean;
  size?: Size;
}

export const Button = ({
  size = 'small',
  children,
  center = false,
  inline = false,
  fullWidth = false,
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
          [styles.fullWidth]: fullWidth,
        }
      )}
    >
      {children}
    </button>
  );
};
