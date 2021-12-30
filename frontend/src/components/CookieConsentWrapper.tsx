import { useSettings } from '../context/SettingsContext';
import { useTextsPrefix } from '../context/TextContext';
import { Button } from './Button/Button';
import styles from './CookieConsentWrapper.module.css';
import { Text } from './Texts/Text';

interface Props {
  children: React.ReactNode;
}

export const CookieConsentWrapper = ({ children }: Props) => {
  const { settings, updateSettings } = useSettings();

  const texts = useTextsPrefix('COOKIE');

  const { cookieConsent } = settings;

  return (
    <div className={styles.wrapper}>
      {children}
      {cookieConsent === 'not_answered' && (
        <div className={styles.consentBox}>
          <Text value="TITLE" texts={texts} tag="h3" />
          <div className={styles.infoBox}>
            <Text value="INFO" texts={texts} tag="text" />
          </div>
          <Button
            inline
            onClick={() =>
              updateSettings({
                ...settings,
                cookieConsent: 'allowed',
              })
            }
          >
            <Text value="SHARED.ALLOW" texts={texts} tag="text" />
          </Button>
          <Button
            inline
            onClick={() =>
              updateSettings({
                ...settings,
                cookieConsent: 'denied',
              })
            }
          >
            <Text value="SHARED.DENY" texts={texts} tag="text" />
          </Button>
        </div>
      )}
    </div>
  );
};
