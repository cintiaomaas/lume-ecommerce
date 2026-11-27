import { get, openCheckout, money, confirmOrder } from "../../support/ui.js";
import { products, cart, putItem, purchase } from "../../support/api.js";

describe("UI - Checkout", () => {
  [["ana", "card", "0,00", "R$ 20,00", "109,90"], ["ana", "cash", "8,99", "R$ 20,00", "100,91"], ["clara", "card", "0,00", "Grátis", "89,90"], ["clara", "cash", "8,99", "Grátis", "80,91"]].forEach(([name, payment, discount, shipping, total], i) => {
    it(`UI-CHE-00${i + 1} [TD][PE] - R0${i + 1}: ${name} paga com ${payment}`, () => {
      openCheckout(`${name}@lume.com`); cy.fillAddress(); get(`payment-${payment}`).click();
      money("cart-subtotal", "89,90"); money("cart-shipping", shipping); money("cart-total", total);
      if (payment === "cash") money("cart-discount", discount); else get("cart-discount").should("not.exist");
      confirmOrder(); cy.get("@checkout").then(({ response }) => expect(response.body.order.discount).to.eq(payment === "cash" ? 899 : 0));
      get("success").should("contain", total); get("close-modal").click();
      get("product-serum").should("contain", "19 disponíveis"); get("open-cart").click(); get("empty-cart").should("be.visible");
      cy.get("@token").then((token) => cart(token).its("body.items").should("be.empty"));
    });
  });
  it("UI-CHE-005 [PE] - Endereço incompleto e campos obrigatórios", () => {
    openCheckout(); get("checkout-submit").click();
    ["street", "city", "state", "zip"].forEach((field) => get(`address-${field}`).then(($input) => expect($input[0].validity.valueMissing).to.eq(true)));
    get("success").should("not.exist");
  });
  it("UI-CHE-006 [PE] - CEP inválido bloqueia confirmação", () => {
    openCheckout(); cy.fillAddress(); get("address-zip").clear().type("123"); get("checkout-submit").click();
    get("address-zip").then(($input) => expect($input[0].validity.patternMismatch).to.eq(true)); get("success").should("not.exist");
  });
  it("UI-CHE-007 [PE] - Carrinho vazio não permite abrir checkout", () => {
    cy.visitLogged(); get("open-cart").click(); get("empty-cart").should("be.visible"); get("open-checkout").should("not.exist");
  });
  it("UI-CHE-008 [PE] - Sem sessão, sacola solicita autenticação", () => {
    cy.visit("/"); get("open-cart").click(); get("login-email").should("be.visible"); get("checkout-submit").should("not.exist");
  });
  it("UI-CHE-009 [PE] - Outro comprador esgota o produto antes da confirmação", () => {
    openCheckout(); cy.fillAddress();
    cy.fixture("endereco").then((address) => cy.loginApi("bia@lume.com").then((bia) => products().then((items) => {
      putItem(bia, items.find((p) => p.kind === "serum")._id, 20); purchase(bia, address);
    })));
    get("checkout-submit").click(); cy.get('[role="alert"]').should("contain", "Estoque insuficiente"); get("success").should("not.exist");
    cy.get("@token").then((token) => cart(token).its("body.items.0.quantity").should("eq", 1));
  });
});
