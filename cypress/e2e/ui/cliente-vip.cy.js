import { get, openCheckout, money, confirmOrder, addProduct } from "../../support/ui.js";
import { profile } from "../../support/api.js";

describe("UI - Clube VIP", () => {
  [29999, 30000, 30001].forEach((spent, i) => {
    it(`UI-VIP-00${i + 1} [AVL] - Compra atinge ${spent} centavos; benefício começa na próxima`, () => {
      cy.task("prepare", { spent: spent - 8990 }); openCheckout(); cy.fillAddress(); money("cart-shipping", "20,00"); confirmOrder();
      cy.get("@token").then((token) => profile(token).its("body").should("include", { spent, vip: spent >= 30000 }));
      get("close-modal").click();
      if (spent >= 30000) get("user-name").should("contain", "VIP"); else get("user-name").should("not.contain", "VIP");
      addProduct(); get("open-cart").click(); money("cart-shipping", spent >= 30000 ? "Grátis" : "20,00");
    });
  });
  it("UI-VIP-004 [PE] - Bia ultrapassa limite com dinheiro, acumulando após desconto e sem frete", () => {
    openCheckout("bia@lume.com"); cy.fillAddress(); get("payment-cash").click(); money("cart-total", "100,91"); confirmOrder();
    cy.get("@token").then((token) => profile(token).its("body").should("include", { spent: 33091, vip: true }));
    get("success").should("contain", "frete grátis nas próximas compras");
  });
});
