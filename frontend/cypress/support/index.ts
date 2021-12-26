import './commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      resetClientFirebase: () => Chainable<Element>;
      login: (props: {
        email: string;
        password: string;
      }) => Chainable<Element>;
      logout: () => Chainable<Element>;
      isUrl: (view: View) => Chainable<Element>;
    }
  }
}

export enum View {
  HOME = '/',
  SETTINGS = '/settings',
  LOGIN = '/login',
  ADD_POST = '/add-post',
}
