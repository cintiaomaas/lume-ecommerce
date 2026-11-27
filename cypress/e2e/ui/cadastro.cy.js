import { get, openRegister, fillRegister } from "../../support/ui.js";

describe("UI - Cadastro", () => {
  it("UI-CAD-001 [PE] - Cadastro válido inicia sessão", () => {
    openRegister(); fillRegister(); cy.intercept("POST", "/api/auth/register").as("register"); get("auth-submit").click();
    cy.wait("@register").its("response.statusCode").should("eq", 201);
    get("user-name").should("contain", "Cliente"); cy.window().its("sessionStorage").invoke("getItem", "lume-token").should("be.a", "string");
  });
  it("UI-CAD-002 [PE] - Campos obrigatórios vazios bloqueiam envio", () => {
    openRegister(); get("auth-submit").click();
    ["name", "email", "password"].forEach((field) => get(`register-${field}`).then(($input) => expect($input[0].validity.valueMissing).to.eq(true)));
    get("user-name").should("not.exist");
  });
  it("UI-CAD-003 [PE] - Formato de e-mail inválido", () => {
    openRegister(); fillRegister({ email: "invalido" }); get("auth-submit").click();
    get("register-email").then(($input) => expect($input[0].validity.typeMismatch).to.eq(true));
  });
  it("UI-CAD-004 [PE] - E-mail duplicado apresenta conflito", () => {
    openRegister(); fillRegister({ email: "ana@lume.com" }); get("auth-submit").click();
    cy.get('[role="alert"]').should("contain", "Registro já existente."); get("register-email").should("be.visible");
  });
  let id = 5;
  [["name", 2, 80, [1, 2, 3, 79, 80, 81]], ["password", 8, 72, [7, 8, 9, 71, 72, 73]]].forEach(([field, min, max, values]) => {
    values.forEach((length) => {
      it(`UI-CAD-${String(id++).padStart(3, "0")} [AVL] - ${field} com ${length} caracteres`, () => {
        openRegister(); fillRegister({ [field]: "A".repeat(length) });
        get(`register-${field}`).invoke("val").should("have.length", Math.min(length, max));
        if (length < min) {
          // cy.type é sintético: minlength pode não ativar validity.tooShort.
          get(`register-${field}`).should("have.attr", "minlength", String(min));
          cy.intercept("POST", "/api/auth/register").as("invalidRegister");
          get("auth-submit").click();
          cy.wait("@invalidRegister").its("response.statusCode").should("eq", 400);
          cy.get('[role="alert"]').should("contain", "Confira os campos informados.");
          get("user-name").should("not.exist");
        } else {
          cy.intercept("POST", "/api/auth/register").as("register"); get("auth-submit").click();
          cy.wait("@register").its("response.statusCode").should("eq", 201); get("user-name").should("be.visible");
        }
      });
    });
  });
});
