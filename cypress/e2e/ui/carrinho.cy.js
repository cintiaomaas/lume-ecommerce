import { get, addProduct } from "../../support/ui.js";
import { products, putItem } from "../../support/api.js";

describe("UI - Carrinho", () => {
  it("UI-CAR-001 [CRUD] - Adiciona, consulta, aumenta, diminui, remove e adiciona novamente", () => {
    cy.visitLogged(); addProduct(); get("open-cart").click(); get("cart-serum").should("contain", "Sérum Ilumina");
    get("quantity").should("have.text", "1"); get("increase").click(); get("quantity").should("have.text", "2");
    get("decrease").should("be.enabled").click(); get("quantity").should("have.text", "1");
    get("remove").should("be.enabled").click(); get("empty-cart").should("be.visible");
    get("close-modal").click(); addProduct(); get("open-cart").click(); get("quantity").should("have.text", "1");
  });
  it("UI-CAR-002 [CRUD] - Dois produtos persistem ao recarregar a mesma aba", () => {
    cy.visitLogged(); addProduct(); addProduct("cream"); cy.reload(); get("user-name").should("be.visible"); get("open-cart").click();
    get("cart-serum").should("be.visible"); get("cart-cream").should("be.visible");
    get("cart-serum").find('[data-cy="remove"]').click(); get("cart-serum").should("not.exist"); get("cart-cream").should("be.visible");
  });
  [1, 2, 19, 20].forEach((quantity, i) => {
    it(`UI-CAR-00${i + 3} [AVL] - Quantidade ${quantity} e limite de estoque`, () => {
      cy.visitLogged(); cy.get("@token").then((token) => products().then((items) => putItem(token, items.find((p) => p.kind === "serum")._id, quantity)));
      get("open-cart").click(); get("quantity").should("have.text", String(quantity));
      if (quantity === 20) get("increase").should("be.disabled");
      else { get("increase").click(); get("quantity").should("have.text", String(quantity + 1)); }
    });
  });
  it("UI-CAR-007 [AVL][CRUD] - Diminuir abaixo de 1 remove o último item", () => {
    cy.visitLogged(); addProduct(); get("open-cart").click(); get("decrease").click(); get("empty-cart").should("be.visible"); get("open-checkout").should("not.exist");
  });
  it("UI-CAR-008 [AVL] - Nova adição de 21ª unidade apresenta erro de estoque", () => {
    cy.visitLogged(); cy.get("@token").then((token) => products().then((items) => putItem(token, items.find((p) => p.kind === "serum")._id, 20)));
    get("product-serum").find('[data-cy="add-product"]').click(); cy.get('[role="alert"]').should("contain", "Estoque insuficiente");
    get("open-cart").click(); get("quantity").should("have.text", "20");
  });
});
