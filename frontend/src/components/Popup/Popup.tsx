import { useCallback, useEffect } from 'react';
import { Button } from '../Button/Button';
import styles from './Popup.module.css';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export const Popup = ({ children, open, onClose }: Props) => {
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
        <div className={styles.popup}>
          <Button
            className={styles.closeButton}
            onClick={closeModal}
            fullWidth
          >
            Lukk
          </Button>
          {children}
        </div>
        <div className={styles.overlay} onClick={closeModal} />
      </>
    );
  }
  return null;
};
