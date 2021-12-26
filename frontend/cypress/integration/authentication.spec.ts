import { View } from '../support';
import { adminUser } from '../support/data';

describe('authentication', () => {
  beforeEach(() => {
    cy.resetClientFirebase();
    cy.visit('/');
  });

  it('logs into application and redirects to home', () => {
    cy.get('[data-test-id="header-title"]').should('exist');
    cy.get('[data-test-id="header-login"]').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('admin@admin.admin');
    cy.get('input[name="password"]').type('passord');
    cy.get('button[name="submit"]').click();
    cy.isUrl(View.HOME);
  });

  it('logs out successfully', () => {
    cy.login(adminUser);
    cy.logout();
  });
});
