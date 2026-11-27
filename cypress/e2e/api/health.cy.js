import { url, errorResponse, measure } from "../../support/api.js";

describe("API - Disponibilidade e roteamento", () => {
  it("API-HEA-001 [V][A][R] - Health público após aquecimento", () => {
    cy.request(url("/health"));
    cy.request(url("/health")).then((r) => {
      expect(r.status).to.eq(200); expect(r.body).to.deep.eq({ status: "ok" }); measure(r, "health", "healthMs");
    });
  });
  it("API-HEA-002 [V][A] - Publica contrato OpenAPI", () => {
    cy.request(url("/openapi.yaml")).then((r) => {
      expect(r.status).to.eq(200); expect(r.headers["content-type"]).to.include("yaml"); expect(r.body).to.include("openapi: 3.0.3");
    });
  });
  ["/inexistente", "/health", "/products", "/me", "/cart", "/cart/items", "/cart/items/abc", "/checkout", "/auth/login", "/auth/register", "/openapi.yaml"].forEach((path, i) => {
    it(`API-HEA-${String(i + 3).padStart(3, "0")} [V][E] - PATCH ${path} não é suportado`, () => {
      cy.request({ method: "PATCH", url: url(path), failOnStatusCode: false }).then((r) => errorResponse(r, 404, "Endpoint não encontrado."));
      cy.request(url("/products")).its("body").then((items) => expect(Object.fromEntries(items.map((p) => [p.kind, p.stock]))).to.deep.eq({ serum: 20, cream: 15, sun: 0 }));
      cy.loginApi().then((token) => cy.request({ url: url("/me"), headers: { Authorization: `Bearer ${token}` } }).its("body.spent").should("eq", 0));
    });
  });
  it("API-HEA-014 [E] - GET de endpoint inexistente retorna 404", () => {
    cy.request({ url: url("/inexistente"), failOnStatusCode: false }).then((r) => errorResponse(r, 404));
  });
  it("API-HEA-015 [E] - JSON malformado é rejeitado sem stack trace", () => {
    cy.request({ method: "POST", url: url("/auth/login"), headers: { "Content-Type": "application/json" }, body: '{"email":', failOnStatusCode: false })
      .then((r) => errorResponse(r, 400));
  });
});
