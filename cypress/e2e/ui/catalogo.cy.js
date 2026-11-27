import { get } from "../../support/ui.js";

describe("UI - Catálogo", () => {
  [["serum", "Sérum Ilumina", "89,90", 20], ["cream", "Hidratante Abraço", "59,90", 15], ["sun", "Protetor Solar Aurora", "79,90", 0]].forEach(([kind, name, price, stock], i) => {
    it(`UI-CAT-00${i + 1} [PE] - Exibe ${name}, preço e disponibilidade`, () => {
      cy.visit("/"); get(`product-${kind}`).should("contain", name).and("contain", price).and("contain", stock ? `${stock} disponíveis` : "Esgotado");
      get(`product-${kind}`).find('[data-cy="add-product"]').should(stock ? "be.enabled" : "be.disabled");
    });
  });
});
