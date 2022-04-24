import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = JSX.IntrinsicElements['button'];

type Size = 'small' | 'medium' | 'large' | 'none';

interface Props extends ButtonProps {
  fullWidth?: boolean;
  inline?: boolean;
  center?: boolean;
  noBorder?: boolean;
  size?: Size;
}

export const Button = ({
  size = 'small',
  children,
  center = false,
  inline = false,
  fullWidth = false,
  noBorder = false,
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
          [styles.noBorder]: noBorder,
        }
      )}
    >
      {children}
    </button>
  );
};

interface IconProps extends Omit<Props, 'size' | 'children'> {
  icon: ReactNode;
}

export const IconButton = ({
  icon,
  className,
  ...rest
}: IconProps) => {
  return (
    <Button
      {...rest}
      size="none"
      className={classNames(styles.iconButton, className)}
    >
      {icon}
    </Button>
  );
};
