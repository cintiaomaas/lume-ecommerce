import { get, addProduct } from "../../support/ui.js";

describe("UI - Login e logout", () => {
  beforeEach(() => { cy.visit("/"); get("open-login").click(); });
  it("UI-LOG-001 [PE] - Login válido e logout limpam a sessão visual e local", () => {
    cy.intercept("GET", "/api/me").as("profile");
    get("login-email").type("ana@lume.com"); get("login-password").type("Lume@123"); get("auth-submit").click();
    cy.wait("@profile").its("response.statusCode").should("eq", 200);
    get("user-name").should("contain", "Ana");
    addProduct();
    get("logout").click();
    get("open-login").should("be.visible"); get("user-name").should("not.exist");
    cy.window().its("sessionStorage").invoke("getItem", "lume-token").should("be.null");
    get("open-cart").click(); get("login-email").should("be.visible");
  });
  [["ausente@example.com", "Lume@123"], ["ana@lume.com", "Incorreta"]].forEach(([email, password], i) => {
    it(`UI-LOG-00${i + 2} [PE] - Credenciais inválidas ${i + 1}`, () => {
      get("login-email").type(email); get("login-password").type(password); get("auth-submit").click();
      cy.get('[role="alert"]').should("contain", "E-mail ou senha incorretos."); get("user-name").should("not.exist");
      cy.window().its("sessionStorage").invoke("getItem", "lume-token").should("be.null");
    });
  });
  it("UI-LOG-004 [PE] - E-mail inválido bloqueado pelo navegador", () => {
    get("login-email").type("invalido"); get("login-password").type("Lume@123"); get("auth-submit").click();
    get("login-email").then(($input) => expect($input[0].validity.typeMismatch).to.eq(true));
  });
  it("UI-LOG-005 [PE] - Campos obrigatórios bloqueiam envio", () => {
    get("auth-submit").click();
    ["email", "password"].forEach((field) => get(`login-${field}`).then(($input) => expect($input[0].validity.valueMissing).to.eq(true)));
  });
  it("UI-LOG-006 [PE] - Adicionar sem autenticação solicita login", () => {
    get("close-modal").click(); get("product-serum").find('[data-cy="add-product"]').click(); get("login-email").should("be.visible");
  });
  it("UI-LOG-007 [PE] - Logout permanece efetivo quando o perfil chega depois de sair", () => {
    let releaseProfile;
    // Mantém a resposta REAL pendente até o logout; não substitui corpo/status.
    cy.intercept("GET", "/api/me", (req) => {
      delete req.headers["if-none-match"];
      delete req.headers["if-modified-since"];
      req.continue(() => new Cypress.Promise((resolve) => { releaseProfile = resolve; }));
    }).as("lateProfile");
    get("login-email").type("ana@lume.com"); get("login-password").type("Lume@123"); get("auth-submit").click();
    cy.wrap(null).should(() => expect(releaseProfile).to.be.a("function"));
    get("logout").click();
    cy.window().its("sessionStorage").invoke("getItem", "lume-token").should("be.null");
    cy.then(() => { releaseProfile(); });
    cy.wait("@lateProfile").its("response.statusCode").should("eq", 200);
    get("open-login").should("be.visible"); get("user-name").should("not.exist");
  });
});
