import { View } from '../support';

describe('app', () => {
  it('renders', () => {
    cy.visit('/');
    cy.get('[data-test-id="post-header"]').should('exist');
    cy.isUrl(View.HOME);
  });
});
