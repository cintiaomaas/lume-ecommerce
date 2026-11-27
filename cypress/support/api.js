export const url = (path) => `${Cypress.expose("apiUrl")}/api${path}`;
export const headers = (token) => ({ Authorization: `Bearer ${token}` });
export const uniqueEmail = () => `qa-${crypto.randomUUID()}@example.com`;
export function products() { return cy.request(url("/products")).its("body"); }
export function putItem(token, productId, quantity) {
  return cy.request({ method: "PUT", url: url("/cart/items"), headers: headers(token), body: { productId, quantity } });
}
export function cart(token) { return cy.request({ url: url("/cart"), headers: headers(token) }); }
export function profile(token) { return cy.request({ url: url("/me"), headers: headers(token) }); }
export function purchase(token, address, payment = "card", key = crypto.randomUUID()) {
  return cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(token), "Idempotency-Key": key }, body: { payment, address } });
}
export function errorResponse(response, status, message) {
  expect(response.status).to.eq(status);
  expect(response.body.message).to.be.a("string").and.not.empty;
  if (message) expect(response.body.message).to.eq(message);
  expect(response.body).not.to.have.any.keys("stack", "password", "token");
}
export function measure(response, endpoint, limit) {
  cy.task("timing", { endpoint, duration: response.duration, limit: Number(Cypress.expose(limit)) });
  expect(response.duration, endpoint).to.be.lessThan(Number(Cypress.expose(limit)));
}
