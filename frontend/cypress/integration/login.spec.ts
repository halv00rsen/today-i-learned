describe('TIL app', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('logs into application and redirects to home', () => {
    cy.visit('/');
    cy.get('[data-test-id="header-title"]').should('exist');
    cy.get('[data-test-id="post-header"]').should('exist');
    cy.get('[data-test-id="header-login"]').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('admin@admin.admin');
    cy.get('input[name="password"]').type('passord');
    cy.get('button[name="submit"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
