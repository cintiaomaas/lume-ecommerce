Cypress.Commands.add("loginApi", (email = "ana@lume.com") => {
  return cy.fixture("usuarios").then(({ password }) => cy.request("POST", `${Cypress.expose("apiUrl")}/api/auth/login`, { email, password }))
    .then(({ body }) => { expect(body.token).to.be.a("string").and.not.empty; return body.token; });
});

Cypress.Commands.add("visitLogged", (email = "ana@lume.com") => {
  cy.loginApi(email).then((token) => {
    cy.wrap(token).as("token");
    cy.visit("/", { onBeforeLoad(win) { win.sessionStorage.setItem("lume-token", token); } });
  });
  cy.get('[data-cy="user-name"]').should("be.visible");
});

Cypress.Commands.add("fillAddress", () => {
  cy.fixture("endereco").then((address) => {
    Object.entries(address).forEach(([name, value]) => cy.get(`[data-cy="address-${name}"]`).clear().type(value));
  });
});
