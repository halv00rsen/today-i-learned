const no: Omit<Texts, typeof LANGUAGE_KEY> = {
  'shared.error': 'En feil skjedde',
  'shared.remove': 'Fjern',
  'shared.close': 'Lukk',
  'shared.removeall': 'Fjern alle',
  'shared.filter': 'Filter',
  'shared.save': 'Lagre',
  'settings.title': 'Innstillinger',
  'settings.nightmode': 'Nattmodus',
  'settings.language': 'Språk',
  'settings.on': 'På',
  'settings.off': 'Av',
  'settings.clientinfo': 'Klientinformasjon',
  'settings.buildtime': 'Byggtidspunkt',
  'settings.version': 'Klientversjon',
  'settings.userinfo.title': 'Brukerinfo',
  'settings.userinfo.name': 'Navn',
  'settings.userinfo.email': 'Epost',
  'settings.userinfo.roles': 'Roller',
  'settings.userinfo.logout': 'Logg ut',
  'settings.language.no': 'Norsk',
  'settings.language.en': 'Engelsk',
  'header.title': 'Today I Learned',
  'header.newpost': 'Nytt innlegg',
  'header.myposts': 'Mine innlegg',
  'header.login': 'Logg inn',
  'header.settings': 'Innstillinger',
  'login.title': 'Logg inn',
  'login.email.placeholder': 'Epost',
  'login.password.placeholder': 'Passord',
  'login.action': 'Logg inn',
  'login.error':
    'En feil skjedde ved innloggin. Vennligst prøv igjen.',
  'newpost.title': 'Legg til nytt innlegg',
  'newpost.hashtag.title': 'Emneknagger',
  'newpost.hashtag.add': 'Legg til emneknagg',
  'newpost.preview.title': 'Forhåndsvisning av innlegg',
  'newpost.publish': 'Publiser',
  'newpost.save': 'Lagre arbeid',
  'userpost.unpublished': 'Upubliserte innlegg',
  'userpost.published': 'Dine publiserte innlegg',
  'post.edit': 'Endre',
  'post.delete': 'Slett',
  'post.future_publish_date': 'Publiseres den {}',
  'post.not_published': 'Ikke publisert',
  'posts.last': 'Ingen flere poster',
  'posts.error': 'En feil skjedde under lasting',
  'filters.title': 'Velg hvilke emneknagger du vil filtrere på',
};

const en: Omit<Texts, typeof LANGUAGE_KEY> = {
  'shared.error': 'An error occured',
  'shared.remove': 'Remove',
  'shared.close': 'Close',
  'shared.filter': 'Filters',
  'shared.removeall': 'Remove all',
  'shared.save': 'Save',
  'settings.title': 'Settings',
  'settings.nightmode': 'Night mode',
  'settings.language': 'Language',
  'settings.on': 'On',
  'settings.off': 'Off',
  'settings.clientinfo': 'Client information',
  'settings.buildtime': 'Build time',
  'settings.version': 'Client version',
  'settings.userinfo.title': 'User information',
  'settings.userinfo.name': 'Name',
  'settings.userinfo.email': 'Email',
  'settings.userinfo.roles': 'User roles',
  'settings.userinfo.logout': 'Log out',
  'settings.language.no': 'Norwegian',
  'settings.language.en': 'English',
  'header.title': 'Today I Learned',
  'header.newpost': 'New post',
  'header.myposts': 'My posts',
  'header.login': 'Login',
  'header.settings': 'Settings',
  'login.title': 'Log in',
  'login.email.placeholder': 'Email',
  'login.password.placeholder': 'Password',
  'login.action': 'Log in',
  'login.error':
    'An error occured during login. Please try again.',
  'newpost.title': 'Add new post',
  'newpost.hashtag.title': 'Hashtags',
  'newpost.hashtag.add': 'Add hashtag',
  'newpost.preview.title': 'Preview of post',
  'newpost.publish': 'Publish',
  'newpost.save': 'Save work',
  'userpost.unpublished': 'Unpublished posts',
  'userpost.published': 'Your published posts',
  'post.edit': 'Edit',
  'post.delete': 'Delete',
  'post.future_publish_date': 'Publishes the {}',
  'post.not_published': 'Not published',
  'posts.last': 'Last post reached',
  'posts.error': 'An error happend during loading',
  'filters.title': 'Choose which hashtags to filter on',
};

export const languages = ['EN', 'NO'] as const;

export type Language = typeof languages[number];

export const isSupportedLanguage = (
  language: string
): language is Language => {
  return languages.includes(language as Language);
};

const PREFIX_KEY = '[prefix]';
const LANGUAGE_KEY = '[language]';

export interface Texts {
  [LANGUAGE_KEY]: Language;
  [key: string]: string;
}

export const getInitialTexts = (
  language: Language,
  prefix?: string
): Texts => {
  if (prefix) {
    return {
      [LANGUAGE_KEY]: language,
      [PREFIX_KEY]: prefix,
    };
  }
  return {
    [LANGUAGE_KEY]: language,
  };
};

export const getPrefixKey = (texts: Texts): string | undefined => {
  return texts[PREFIX_KEY];
};

export const getLanguage = (texts: Texts): Language =>
  texts[LANGUAGE_KEY];

export const fetchTexts = async (
  language: Language
): Promise<Omit<Texts, typeof LANGUAGE_KEY>> => {
  if (language === 'EN') {
    return en;
  }
  return no;
};
