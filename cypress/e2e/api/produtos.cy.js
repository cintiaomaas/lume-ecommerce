import { products, measure } from "../../support/api.js";
import { url } from "../../support/api.js";

describe("API - Produtos", () => {
  it("API-PRO-001 [V][A][D][R] - Catálogo público contém preços e estoques do seed", () => {
    products();
    cy.request(url("/products")).then((r) => {
      expect(r.status).to.eq(200); measure(r, "products", "productsMs");
      expect(r.body).to.have.length(3);
      [["serum", "Sérum Ilumina", 8990, 20], ["cream", "Hidratante Abraço", 5990, 15], ["sun", "Protetor Solar Aurora", 7990, 0]].forEach(([kind, name, price, stock]) => {
        const product = r.body.find((p) => p.kind === kind);
        expect(product).to.include({ name, price, stock }); expect(product._id).to.match(/^[a-f\d]{24}$/);
        expect(Number.isInteger(product.price)).to.eq(true);
      });
    });
  });
});
