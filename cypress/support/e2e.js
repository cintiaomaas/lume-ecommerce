import "./commands.js";
import "cypress-mochawesome-reporter/register";

beforeEach(() => {
  cy.task("reset");
  Cypress.session.clearAllSavedSessions();
});
