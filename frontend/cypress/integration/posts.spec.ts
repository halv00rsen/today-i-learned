import { View } from '../support';
import { adminUser, newPost, regularUser } from '../support/data';

describe('posts view', () => {
  describe('unauthenticated user', () => {
    beforeEach(() => {
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
    beforeEach(() => {
      cy.resetClientFirebase();
      cy.visit(View.HOME);
      cy.login(regularUser);
    });

    it('should not display app posts', () => {
      cy.get('[data-test-id="header-add-posts"]').should(
        'not.exist'
      );
    });
  });

  describe('authenticated admin user', () => {
    beforeEach(() => {
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

      cy.get('[data-test-id="open-edit-tags-button"]').click();
      tags.forEach((tag) => {
        cy.get('[data-test-id="edit-post-tag"]').type(tag);
        cy.get('[data-test-id="add-tag-button"]').click();
      });
      cy.get('[data-test-id="popup-close-button"]').click();

      cy.get('[data-test-id="publish-checkbox"]').check();

      cy.get('[data-test-id="save-post-button"]').click();

      cy.isUrl(View.HOME);

      cy.get('[data-test-id="post-header"]').contains(title);

      cy.get('[data-test-id="edit-post-button"]').first().click();

      cy.get('[data-test-id="delete-post-button"]').click();

      cy.get('[data-test-id="post-header"]').should(
        'not.contain.text',
        title
      );
    });
  });
});
