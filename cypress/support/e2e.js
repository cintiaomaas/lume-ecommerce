import "./commands.js";

beforeEach(() => {
  cy.task("reset");
  Cypress.session.clearAllSavedSessions();
});
