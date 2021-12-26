Cypress.Commands.add('resetClientFirebase', () => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
});

Cypress.Commands.add('login', ({ password, email }) => {
  cy.get('[data-test-id="header-login"]').click();
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[name="submit"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-test-id="header-settings"]').click();
  cy.get('[data-test-id="logout-button"]').click();
});

Cypress.Commands.add('isUrl', (view) => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${view}`);
});
