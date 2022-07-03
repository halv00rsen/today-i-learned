import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { useCallback, useEffect } from 'react';
import { useTextsPrefix } from '../../context/TextContext';
import { Button } from '../Button/Button';
import { getText } from '../Texts/Text';
import styles from './Popup.module.css';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  relative?: {
    direction: 'above' | 'below';
  };
}

export const Popup = ({
  children,
  open,
  onClose,
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
      <FocusTrap>
        <div>
          <dialog
            open={true}
            className={classNames(styles.popup, {
              [styles.relative]: !!relative,
              [styles.unrelative]: !relative,
              [styles[relative?.direction || 'below']]: !!relative,
            })}
          >
            <Button
              data-test-id="popup-close-button"
              aria-label={getText({ texts, value: 'CLOSE' })}
              className={styles.closeButton}
              onClick={closeModal}
            >
              X
            </Button>
            <span className={styles.children}>{children}</span>
          </dialog>
          <div
            aria-hidden="true"
            className={styles.overlay}
            onClick={closeModal}
          />
        </div>
      </FocusTrap>
    );
  }
  return null;
};
