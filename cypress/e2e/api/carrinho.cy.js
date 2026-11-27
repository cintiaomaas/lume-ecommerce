import { url, headers, products, putItem, cart, errorResponse, measure } from "../../support/api.js";

describe("API - Carrinho", () => {
  beforeEach(() => {
    cy.loginApi().as("token");
    products().then((items) => cy.wrap(items.find((p) => p.kind === "serum")._id).as("productId"));
  });
  it("API-CAR-001 [V][D][R] - PUT absoluto idempotente, leitura, atualização e exclusão", function () {
    cart(this.token).its("body").should("deep.eq", { items: [], subtotal: 0, discount: 0, shipping: 0, total: 0 });
    putItem(this.token, this.productId, 2);
    putItem(this.token, this.productId, 2).its("body.items").should("have.length", 1);
    cart(this.token).then((r) => {
      expect(r.body).to.include({ subtotal: 17980, discount: 0, shipping: 2000, total: 19980 });
      expect(r.body.items[0].quantity).to.eq(2); measure(r, "cart", "cartMs");
    });
    putItem(this.token, this.productId, 1).its("body.subtotal").should("eq", 8990);
    cy.request({ method: "DELETE", url: url(`/cart/items/${this.productId}`), headers: headers(this.token) }).its("body.items").should("be.empty");
    putItem(this.token, this.productId, 1).its("body.items").should("have.length", 1);
  });
  [-1, 0, 1, 2, 19, 20, 21, 98, 99, 100, 1.5, "1", null].forEach((quantity, i) => {
    const status = !Number.isInteger(quantity) || quantity < 1 || quantity > 99 ? 400 : quantity > 20 ? 409 : 200;
    it(`API-CAR-${String(i + 2).padStart(3, "0")} [D]${status >= 400 ? "[E]" : ""} - Quantidade ${JSON.stringify(quantity)}: HTTP ${status}`, function () {
      cy.request({ method: "PUT", url: url("/cart/items"), headers: headers(this.token), body: { productId: this.productId, quantity }, ...(status >= 400 ? { failOnStatusCode: false } : {}) }).then((r) => {
        expect(r.status).to.eq(status);
        if (status === 200) expect(r.body.items[0].quantity).to.eq(quantity);
        else errorResponse(r, status, status === 400 ? "Confira os campos informados." : "Estoque insuficiente para esta quantidade.");
      });
    });
  });
  [98, 99].forEach((quantity, i) => {
    it(`API-CAR-0${20 + i} [D] - Limite contratual ${quantity} com estoque controlado`, function () {
      cy.task("prepare", { stock: 99 });
      putItem(this.token, this.productId, quantity).its("body.items.0.quantity").should("eq", quantity);
    });
  });
  ["abc", "000000000000000000000000", null, undefined].forEach((productId, i) => {
    it(`API-CAR-0${22 + i} [D][E] - Identificador inválido ou inexistente ${i + 1}`, function () {
      cy.request({ method: "PUT", url: url("/cart/items"), headers: headers(this.token), body: { productId, quantity: 1 }, failOnStatusCode: false })
        .then((r) => errorResponse(r, i === 1 ? 409 : 400));
    });
  });
  it("API-CAR-026 [D][E] - Produto esgotado e pagamento inválido", function () {
    products().then((items) => cy.request({ method: "PUT", url: url("/cart/items"), headers: headers(this.token), body: { productId: items.find((p) => p.kind === "sun")._id, quantity: 1 }, failOnStatusCode: false })).then((r) => errorResponse(r, 409));
    cy.request({ url: url("/cart?payment=pix"), headers: headers(this.token), failOnStatusCode: false }).then((r) => errorResponse(r, 400));
    cart(this.token).its("body.items").should("be.empty");
  });
});
