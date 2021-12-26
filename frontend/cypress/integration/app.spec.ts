import { View } from '../support';

describe('app', () => {
  it('renders', () => {
    cy.visit('/');
    cy.get('[data-test-id="header-title"]').should('exist');
    cy.isUrl(View.HOME);
  });
});
