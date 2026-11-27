import { url, errorResponse } from "../../support/api.js";

describe("API - Rate limiting isolado por reset", () => {
  it("API-RAT-001 [E] - Permite 50 tentativas e bloqueia a 51ª", () => {
    for (let n = 1; n <= 51; n++) {
      cy.request({ method: "POST", url: url("/auth/login"), body: { email: "ausente@example.com", password: "Lume@123" }, failOnStatusCode: false }).then((r) => {
        errorResponse(r, n <= 50 ? 401 : 429);
        if (n === 51) expect(r.body.message).to.eq("Muitas tentativas. Tente novamente em 15 minutos.");
      });
    }
  });
});
