export const get = (name) => cy.get(`[data-cy="${name}"]`);
export function openRegister() {
  cy.visit("/"); get("open-login").click(); get("switch-auth").click();
}
export function fillRegister({ name = "Cliente QA", email = `qa-${crypto.randomUUID()}@example.com`, password = "Lume@123" } = {}) {
  get("register-name").type(name, { delay: 0 }); get("register-email").type(email, { delay: 0 }); get("register-password").type(password, { delay: 0 });
}
export function addProduct(kind = "serum") {
  cy.intercept("PUT", "/api/cart/items").as("addItem");
  get(`product-${kind}`).find('[data-cy="add-product"]').should("be.enabled").click();
  cy.wait("@addItem").its("response.statusCode").should("eq", 200);
  get(`product-${kind}`).find('[data-cy="add-product"]').should("be.enabled");
}
export function openCheckout(email = "ana@lume.com") {
  cy.visitLogged(email); addProduct(); get("open-cart").click(); get("cart-serum").should("be.visible"); get("open-checkout").click();
}
export function money(name, value) {
  get(name).invoke("text").should((text) => expect(text.replace(/\s/g, " ")).to.include(value));
}
export function confirmOrder() {
  cy.intercept("POST", "/api/checkout").as("checkout"); get("checkout-submit").click();
  cy.wait("@checkout").its("response.statusCode").should("eq", 201);
  get("success").should("be.visible").and("contain", "Pedido confirmado!");
}
