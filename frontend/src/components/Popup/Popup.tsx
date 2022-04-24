import classNames from 'classnames';
import { useCallback, useEffect } from 'react';
import { useTextsPrefix } from '../../context/TextContext';
import { Button } from '../Button/Button';
import { Text } from '../Texts/Text';
import styles from './Popup.module.css';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  closeButtonOnBottom?: boolean;
  relative?: {
    direction: 'above' | 'below';
  };
}

export const Popup = ({
  children,
  open,
  onClose,
  closeButtonOnBottom = false,
  relative,
}: Props) => {
  const texts = useTextsPrefix('SHARED');

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const hideOnEscape = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };
    if (open) {
      document.addEventListener('keydown', hideOnEscape);
    }
    return () => {
      document.removeEventListener('keydown', hideOnEscape);
    };
  }, [open, closeModal]);

  if (open) {
    return (
      <>
        <dialog
          open={true}
          className={classNames(styles.popup, {
            [styles.popupReverse]: closeButtonOnBottom,
            [styles.relative]: !!relative,
            [styles.unrelative]: !relative,
            [styles[relative?.direction || 'below']]: !!relative,
          })}
        >
          <Button
            data-test-id="popup-close-button"
            className={styles.closeButton}
            onClick={closeModal}
          >
            <Text texts={texts} value="CLOSE" />
          </Button>
          <span>{children}</span>
        </dialog>
        <div
          aria-hidden="true"
          className={styles.overlay}
          onClick={closeModal}
        />
      </>
    );
  }
  return null;
};
