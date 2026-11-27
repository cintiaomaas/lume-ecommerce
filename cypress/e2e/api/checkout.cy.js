import { url, headers, products, putItem, cart, profile, purchase, errorResponse, measure } from "../../support/api.js";

describe("API - Checkout e integridade", () => {
  beforeEach(() => {
    cy.fixture("endereco").as("address");
    cy.loginApi().as("token");
    products().then((items) => cy.wrap(items.find((p) => p.kind === "serum")._id).as("productId"));
  });
  const rules = [
    ["ana", "card", 0, 2000, 10990, 8990], ["ana", "cash", 899, 2000, 10091, 8091],
    ["clara", "card", 0, 0, 8990, 43990], ["clara", "cash", 899, 0, 8091, 43091],
  ];
  rules.forEach(([name, payment, discount, shipping, total, spent], i) => {
    it(`API-CHE-00${i + 1} [V][D] - R0${i + 1}: ${name}, ${payment}, integridade da compra`, function () {
      cy.loginApi(`${name}@lume.com`).then((token) => {
        putItem(token, this.productId, 1);
        purchase(token, this.address, payment).then((r) => {
          expect(r.status).to.eq(201); expect(r.body.order).to.include({ subtotal: 8990, discount, shipping, total, payment });
          expect(r.body.order._id).to.match(/^[a-f\d]{24}$/); expect(r.body.user.spent).to.eq(spent);
          expect(r.body.order.items[0]).to.include({ productId: this.productId, quantity: 1, price: 8990 });
        });
        cart(token).its("body.items").should("be.empty");
        products().then((items) => expect(items.find((p) => p._id === this.productId).stock).to.eq(19));
      });
    });
  });
  it("API-CHE-005 [D][R] - Idempotência preserva pedido, estoque e acumulado; nova chave compra novamente", function () {
    const key = crypto.randomUUID();
    putItem(this.token, this.productId, 1);
    purchase(this.token, this.address, "card", key).then(({ body: first }) => {
      purchase(this.token, this.address, "card", key).then((r) => {
        expect(r.status).to.eq(201); expect(r.body.order).to.deep.eq(first.order); expect(r.body.user.spent).to.eq(8990);
        measure(r, "checkout", "checkoutMs");
      });
      products().then((items) => expect(items.find((p) => p._id === this.productId).stock).to.eq(19));
      cart(this.token).its("body.items").should("be.empty");
      putItem(this.token, this.productId, 1);
      purchase(this.token, this.address).then((r) => { expect(r.body.order._id).not.to.eq(first.order._id); expect(r.body.user.spent).to.eq(17980); });
      products().then((items) => expect(items.find((p) => p._id === this.productId).stock).to.eq(18));
    });
  });
  const invalid = [
    ["pagamento ausente", (body) => { delete body.payment; }],
    ["pagamento desconhecido", (body) => { body.payment = "pix"; }],
    ["pagamento nulo", (body) => { body.payment = null; }],
    ["endereço ausente", (body) => { delete body.address; }],
    ["endereço nulo", (body) => { body.address = null; }],
    ...["recipient", "street", "city", "state", "zip"].flatMap((field) => [undefined, "", null, 123].map((value) => [`${field}: ${String(value)}`, (body) => { if (value === undefined) delete body.address[field]; else body.address[field] = value; }])),
    ["UF minúscula", (body) => { body.address.state = "sp"; }],
    ["UF longa", (body) => { body.address.state = "SPP"; }],
    ["CEP curto", (body) => { body.address.zip = "0100100"; }],
    ["CEP longo", (body) => { body.address.zip = "010010000"; }],
    ["CEP alfabético", (body) => { body.address.zip = "abcdefgh"; }],
  ];
  invalid.forEach(([label, change], i) => {
    it(`API-CHE-${String(10 + i).padStart(3, "0")} [D][E] - Rejeita ${label} sem efeitos parciais`, function () {
      putItem(this.token, this.productId, 1);
      const body = { payment: "card", address: { ...this.address } }; change(body);
      cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), "Idempotency-Key": crypto.randomUUID() }, body, failOnStatusCode: false }).then((r) => errorResponse(r, 400));
      cart(this.token).its("body.items.0.quantity").should("eq", 1);
      profile(this.token).its("body").should("include", { spent: 0, vip: false });
      products().then((items) => expect(items.find((p) => p._id === this.productId).stock).to.eq(20));
    });
  });
  let boundaryId = 50;
  [["recipient", 2, 80], ["street", 3, 160], ["city", 2, 80]].forEach(([field, min, max]) => {
    [min - 1, min, min + 1, max - 1, max, max + 1].forEach((length) => {
      const valid = length >= min && length <= max;
      it(`API-CHE-${String(boundaryId++).padStart(3, "0")} [D]${valid ? "" : "[E]"} - Endereço ${field} com ${length} caracteres`, function () {
        putItem(this.token, this.productId, 1);
        cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), "Idempotency-Key": crypto.randomUUID() }, body: { payment: "card", address: { ...this.address, [field]: "A".repeat(length) } }, ...(valid ? {} : { failOnStatusCode: false }) }).its("status").should("eq", valid ? 201 : 400);
      });
    });
  });
  [undefined, "invalida"].forEach((key, i) => {
    it(`API-CHE-0${70 + i} [D][E] - Chave ${key === undefined ? "ausente" : "inválida"}`, function () {
      putItem(this.token, this.productId, 1);
      cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), ...(key ? { "Idempotency-Key": key } : {}) }, body: { payment: "card", address: this.address }, failOnStatusCode: false }).then((r) => errorResponse(r, 400));
      cart(this.token).its("body.items.0.quantity").should("eq", 1);
      profile(this.token).its("body.spent").should("eq", 0);
    });
  });
  it("API-CHE-072 [D][E] - Carrinho vazio rejeitado", function () {
    cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), "Idempotency-Key": crypto.randomUUID() }, body: { payment: "card", address: this.address }, failOnStatusCode: false }).then((r) => errorResponse(r, 400, "Seu carrinho está vazio."));
    profile(this.token).its("body.spent").should("eq", 0);
  });
  it("API-CHE-073 [A][D] - Ignora totais injetados e aceita CEP sem hífen", function () {
    putItem(this.token, this.productId, 1);
    cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), "Idempotency-Key": crypto.randomUUID() }, body: { payment: "cash", address: { ...this.address, zip: "01001000" }, subtotal: 1, total: 1, discount: 99999, shipping: 0, vip: true, spent: 90000 } }).then((r) => {
      expect(r.body.order).to.include({ subtotal: 8990, discount: 899, shipping: 2000, total: 10091 }); expect(r.body.user).to.include({ spent: 8091, vip: false });
    });
  });
  it("API-CHE-074 [D] - Arredonda desconto de meio centavo com produto exclusivo QA", function () {
    cy.task("prepare", { rounding: true });
    products().then((items) => putItem(this.token, items.find((p) => p.kind === "qa")._id, 1));
    purchase(this.token, this.address, "cash").then((r) => {
      expect(r.body.order).to.include({ subtotal: 10005, discount: 1001, shipping: 2000, total: 11004 }); expect(r.body.user.spent).to.eq(9004);
    });
  });
  [29999, 30000, 30001].forEach((spent, i) => {
    it(`API-CHE-0${75 + i} [D] - Transição VIP ao atingir ${spent} centavos`, function () {
      cy.task("prepare", { spent: spent - 8990 });
      putItem(this.token, this.productId, 1);
      purchase(this.token, this.address).then((r) => {
        expect(r.body.user).to.include({ spent, vip: spent >= 30000 }); expect(r.body.order.shipping).to.eq(2000);
      });
      putItem(this.token, this.productId, 1);
      cart(this.token).its("body.shipping").should("eq", spent >= 30000 ? 0 : 2000);
    });
  });
  it("API-CHE-078 [D][E] - Segundo cliente perde estoque e transação reverte inclusive item anterior", function () {
    cy.loginApi("bia@lume.com").then((bia) => products().then((items) => {
      const cream = items.find((p) => p.kind === "cream")._id;
      putItem(this.token, cream, 1);
      putItem(this.token, this.productId, 2);
      putItem(bia, this.productId, 19);
      purchase(bia, this.address);
      cy.request({ method: "POST", url: url("/checkout"), headers: { ...headers(this.token), "Idempotency-Key": crypto.randomUUID() }, body: { payment: "card", address: this.address }, failOnStatusCode: false }).then((r) => errorResponse(r, 409));
      products().then((after) => {
        expect(after.find((p) => p._id === cream).stock).to.eq(15);
        expect(after.find((p) => p._id === this.productId).stock).to.eq(1);
      });
      cart(this.token).its("body.items").should("have.length", 2);
      profile(this.token).its("body").should("include", { spent: 0, vip: false });
    }));
  });
  it("API-CHE-079 [D][E] - Concorrência real permite somente um comprador do último estoque", function () {
    cy.loginApi("bia@lume.com").then((bia) => {
      putItem(this.token, this.productId, 20); putItem(bia, this.productId, 20);
      cy.task("concurrentCheckout", [this.token, bia].map((token) => ({ token, key: crypto.randomUUID(), body: { payment: "card", address: this.address } }))).then((responses) => {
        expect(responses.map((r) => r.status).sort()).to.deep.eq([201, 409]);
        responses.forEach((r, i) => {
          const token = [this.token, bia][i];
          cart(token).its("body.items").should("have.length", r.status === 201 ? 0 : 1);
          profile(token).its("body.spent").should("eq", [0, 25000][i] + (r.status === 201 ? 179800 : 0));
        });
      });
      products().then((items) => expect(items.find((p) => p._id === this.productId).stock).to.eq(0));
    });
  });
  it("API-CHE-080 [R] - Mede compra real após aquecer transação de checkout", function () {
    putItem(this.token, this.productId, 1); purchase(this.token, this.address);
    putItem(this.token, this.productId, 1); purchase(this.token, this.address).then((r) => measure(r, "checkout", "checkoutMs"));
  });
});
