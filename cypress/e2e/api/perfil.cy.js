import { url, headers, profile, errorResponse, measure, putItem, products, cart } from "../../support/api.js";

describe("API - Perfil e autorização", () => {
  ["ana", "bia", "clara"].forEach((name, i) => {
    it(`API-PER-00${i + 1} [V][A][D][R] - Perfil ${name} e referência de tempo`, () => {
      cy.loginApi(`${name}@lume.com`).then((token) => {
        profile(token);
        profile(token).then((r) => {
          expect(r.status).to.eq(200); expect(r.body.spent).to.eq([0, 25000, 35000][i]); expect(r.body.vip).to.eq(i === 2);
          expect(r.body).to.have.all.keys("id", "name", "email", "spent", "vip"); measure(r, "profile", "profileMs");
        });
      });
    });
  });
  const endpoints = [["GET", "/me"], ["GET", "/cart"], ["PUT", "/cart/items"], ["DELETE", "/cart/items/abc"], ["POST", "/checkout"]];
  endpoints.forEach(([method, path], i) => {
    ["ausente", "inválido", "malformado", "expirado"].forEach((kind, j) => {
      it(`API-PER-${String(10 + i * 4 + j).padStart(3, "0")} [A][E] - ${method} ${path}: token ${kind}`, () => {
        const token = kind === "expirado" ? cy.task("expiredToken") : cy.wrap(kind === "inválido" ? "eyJhbGciOiJIUzI1NiJ9.e30.invalid" : "abc");
        token.then((value) => cy.request({ method, url: url(path), headers: kind === "ausente" ? {} : headers(value), failOnStatusCode: false }))
          .then((r) => errorResponse(r, 401, "Sua sessão expirou. Entre novamente."));
      });
    });
  });
  it("API-PER-030 [A][D] - Carrinhos isolados e userId enviado não muda proprietário", () => {
    cy.loginApi().then((ana) => cy.loginApi("bia@lume.com").then((bia) => products().then((items) => {
      const id = items.find((p) => p.kind === "serum")._id;
      profile(bia).then(({ body: user }) => cy.request({ method: "PUT", url: url("/cart/items"), headers: headers(ana), body: { productId: id, quantity: 2, userId: user.id } }));
      cart(ana).its("body.items.0.quantity").should("eq", 2);
      cart(bia).its("body.items").should("be.empty");
      cy.request({ method: "DELETE", url: url(`/cart/items/${id}`), headers: headers(bia) });
      cart(ana).its("body.items.0.quantity").should("eq", 2);
    })));
  });
});
