import { View } from '../support';
import { adminUser, newPost, regularUser } from '../support/data';

describe('posts view', () => {
  describe('unauthenticated user', () => {
    before(() => {
      cy.resetClientFirebase();
      cy.visit(View.HOME);
    });

    it('should display posts in home', () => {
      cy.get('[data-test-id="post-header"]').should('exist');
    });

    it('should not display app posts', () => {
      cy.get('[data-test-id="header-add-posts"]').should(
        'not.exist'
      );
    });
  });

  describe('authenticated regular user', () => {
    before(() => {
      cy.resetClientFirebase();
      cy.visit(View.HOME);
      cy.login(regularUser);
    });

    it('should not display app posts', () => {
      cy.get('[data-test-id="header-add-posts"]').should(
        'not.exist'
      );
    });

    it('redirects to home if authenticated', () => {
      cy.visit(View.LOGIN);
      cy.isUrl(View.HOME);
    });
  });

  describe('authenticated admin user', () => {
    before(() => {
      cy.resetClientFirebase();
      cy.visit(View.HOME);
      cy.login(adminUser);
    });

    it('should show add posts', () => {
      cy.get('[data-test-id="header-add-posts"]').click();
      cy.isUrl(View.ADD_POST);

      const { content, title, tags } = newPost;
      cy.get('[data-test-id="edit-post-title"]').type(title);
      cy.get('[data-test-id="editor"]').type(content);

      tags.forEach((tag) => {
        cy.get('[data-test-id="edit-post-tag"]').type(tag);
        cy.get('[data-test-id="add-tag-button"]').click();
      });

      cy.get('[data-test-id="publish-checkbox"]').check();

      cy.get('[data-test-id="save-post-button"]').click();

      cy.isUrl(View.HOME);

      cy.get('[data-test-id="post-header"]')
        .first()
        .contains(title);

      cy.get('[data-test-id="delete-post-button"]')
        .first()
        .click();

      // uncomment when this works on same page
      // cy.get('[data-test-id="post-header"]')
      //   .first()
      //   .contains(title)
      //   .should('be.false');
    });
  });
});
