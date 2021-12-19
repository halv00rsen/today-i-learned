import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchTexts,
  getInitialTexts,
  getLanguage,
  getPrefixKey,
  Language,
  Texts,
} from '../utils/texts';
import { Spinner } from '../components/Spinner/Spinner';
import { useSettings } from './SettingsContext';

type TextStatus =
  | {
      status: 'provider_not_initialized';
    }
  | {
      status: 'not_loaded';
    }
  | {
      status: 'loaded';
      language: Language;
      readonly texts: Texts;
    }
  | {
      status: 'loading';
    }
  | {
      status: 'load_error';
      errorMsg: string;
    };

const TextContext = createContext<TextStatus>({
  status: 'provider_not_initialized',
});

export const useTexts = (): Texts => {
  const textContext = useContext(TextContext);
  if (textContext.status === 'provider_not_initialized') {
    throw new Error(
      'Texts is not loaded yet. Wrap in TextProvider'
    );
  } else if (textContext.status !== 'loaded') {
    throw new Error('Texts are not yet loaded');
  }
  return textContext.texts;
};

interface Props {
  children: React.ReactNode;
}

export const TextProvider = ({ children }: Props) => {
  const [textStatus, setTextStatus] = useState<TextStatus>({
    status: 'not_loaded',
  });

  const {
    settings: { language },
  } = useSettings();

  const { status } = textStatus;

  useEffect(() => {
    const { status } = textStatus;
    if (
      status === 'not_loaded' ||
      (status === 'loaded' && textStatus.language !== language)
    ) {
      const languageCache = language;
      setTextStatus({ status: 'loading' });
      fetchTexts(language)
        .then((texts) => {
          const textsUppercasePrefix = Object.entries(
            texts
          ).reduce((acc, [key, value]) => {
            return {
              ...acc,
              [key.toUpperCase()]: value,
            };
          }, {});
          setTextStatus({
            status: 'loaded',
            language: languageCache,
            texts: {
              ...textsUppercasePrefix,
              ...getInitialTexts(languageCache),
            },
          });
        })
        .catch(() => {
          setTextStatus({
            status: 'load_error',
            errorMsg: 'unable to load texts',
          });
        });
    }
  }, [language, textStatus]);

  if (status === 'loading' || status === 'not_loaded') {
    return <Spinner />;
  } else if (status === 'load_error') {
    return (
      <div>
        An error occured, please try loading texts again
        <button
          onClick={() => setTextStatus({ status: 'not_loaded' })}
        >
          Load texts
        </button>
      </div>
    );
  }

  return (
    <TextContext.Provider value={textStatus}>
      {children}
    </TextContext.Provider>
  );
};

export const useTextsPrefix = (
  prefix: string,
  cachedTexts?: Texts
): Texts => {
  const allTexts: Texts = useTexts();

  const dataTexts = cachedTexts ?? allTexts;

  const getTextsWithPrefix = useCallback((): Texts => {
    const oldPrefixKey = getPrefixKey(dataTexts);
    const prefixKey = oldPrefixKey
      ? `${oldPrefixKey}.${prefix}`
      : prefix;
    return Object.entries(dataTexts).reduce(
      (textsWithPrefix, [key, value]) => {
        const [keyPrefix, ...restKey] = key.split('.');
        if (keyPrefix === prefix) {
          return {
            ...textsWithPrefix,
            [restKey.join('.')]: value,
          };
        } else if (keyPrefix === 'SHARED') {
          return {
            ...textsWithPrefix,
            [key]: value,
          };
        }
        return textsWithPrefix;
      },
      getInitialTexts(getLanguage(dataTexts), prefixKey)
    );
  }, [prefix, dataTexts]);

  const texts = useMemo(() => {
    return getTextsWithPrefix();
  }, [getTextsWithPrefix]);

  return texts;
};
