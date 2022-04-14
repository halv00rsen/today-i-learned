import { createElement } from 'react';
import {
  getLanguage,
  getPrefixKey,
  Texts,
} from '../../utils/texts';
import styles from './Text.module.css';

type Tag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'i'
  | 'b'
  | 'div'
  | 'label'
  | 'text';

interface Props {
  texts: Texts;
  value: string;
  tag?: Tag;
}

export const Text = ({ value, texts, tag = 'div' }: Props) => {
  const text = getText({ texts, value });

  if (tag === 'text') {
    return <>{text}</>;
  }
  return createElement(
    tag,
    {
      className: styles.div,
    },
    text
  );
};

export const getText = ({ texts, value }: Omit<Props, 'tag'>) => {
  const uppercaseValue = value.toUpperCase();
  if (texts[uppercaseValue] === undefined) {
    const prefix = getPrefixKey(texts);
    const language = getLanguage(texts);
    const key = prefix
      ? `${prefix}.${uppercaseValue}`
      : uppercaseValue;
    console.warn(
      `Missing text key "${key}" for language "${language}"`
    );
    return key;
  }
  return texts[uppercaseValue];
};

const INTERPOLATE_SPLIT = '{}';

export const getInterpolatedText = ({
  texts,
  value,
  interpolate,
}: Omit<Props, 'tag'> & { interpolate: string[] }) => {
  const unpolatedText = getText({ texts, value });
  return interpolate.reduce((text, value) => {
    return text.replace(INTERPOLATE_SPLIT, value);
  }, unpolatedText);
};
