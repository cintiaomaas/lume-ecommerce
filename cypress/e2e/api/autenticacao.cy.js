import { url, uniqueEmail, errorResponse, measure, profile } from "../../support/api.js";

describe("API - Autenticação", () => {
  it("API-AUT-001 [V][A][R] - Login válido, perfil público e tempo após aquecimento", () => {
    cy.loginApi();
    cy.request("POST", url("/auth/login"), { email: "ana@lume.com", password: "Lume@123" }).then((r) => {
      expect(r.status).to.eq(200); expect(r.body.user).to.include({ email: "ana@lume.com", vip: false, spent: 0 });
      expect(r.body.user).to.have.all.keys("id", "name", "email", "vip", "spent"); measure(r, "login", "loginMs");
      profile(r.body.token).its("status").should("eq", 200);
    });
  });
  it("API-AUT-002 [V][D][A] - Cadastro normaliza dados e ignora privilégios injetados", () => {
    const email = uniqueEmail();
    cy.request("POST", url("/auth/register"), { name: "  Cliente QA  ", email: ` ${email.toUpperCase()} `, password: "Lume@123", spent: 50000, vip: true, role: "admin" }).then((r) => {
      expect(r.status).to.eq(201); expect(r.body.user).to.include({ name: "Cliente QA", email, spent: 0, vip: false });
      expect(r.body.user).to.have.all.keys("id", "name", "email", "spent", "vip"); profile(r.body.token).its("body.email").should("eq", email);
    });
  });
  const cases = [
    ...[1, 2, 3, 79, 80, 81].map((n) => ({ field: "name", value: "N".repeat(n), label: `nome ${n}`, status: n >= 2 && n <= 80 ? 201 : 400 })),
    ...[7, 8, 9, 71, 72, 73].map((n) => ({ field: "password", value: "P".repeat(n), label: `senha ${n}`, status: n >= 8 && n <= 72 ? 201 : 400 })),
    ...["name", "email", "password"].flatMap((field) => [undefined, null, "", 123].map((value) => ({ field, value, label: `${field} ${String(value)}`, status: 400 }))),
    { field: "email", value: "invalido", label: "formato do e-mail", status: 400 },
    ...[253, 254, 255].map((n) => ({ field: "email", value: "a".repeat(64) + "@" + "b".repeat(63) + "." + "c".repeat(63) + "." + "d".repeat(n - 197) + ".com", label: `e-mail ${n}`, status: n <= 254 ? 201 : 400 })),
  ];
  cases.forEach(({ field, value, label, status }, i) => {
    it(`API-AUT-${String(i + 3).padStart(3, "0")} [D]${status >= 400 ? "[E]" : ""} - Cadastro: ${label}`, () => {
      const body = { name: "Cliente QA", email: uniqueEmail(), password: "Lume@123", [field]: value };
      if (value === undefined) delete body[field];
      cy.request({ method: "POST", url: url("/auth/register"), body, ...(status >= 400 ? { failOnStatusCode: false } : {}) }).then((r) => {
        expect(r.status).to.eq(status);
        if (status === 201) { expect(r.body.token).to.be.a("string"); expect(r.body.user.spent).to.eq(0); }
        else { errorResponse(r, 400, "Confira os campos informados."); expect(r.body.details.some((d) => d.field === field)).to.eq(true); }
      });
    });
  });
  it("API-AUT-040 [D][E] - E-mail duplicado retorna conflito", () => {
    cy.request({ method: "POST", url: url("/auth/register"), body: { name: "Ana", email: "ANA@LUME.COM", password: "Lume@123" }, failOnStatusCode: false }).then((r) => errorResponse(r, 409));
  });
  [
    { email: "ausente@example.com", password: "Lume@123", status: 401 },
    { email: "ana@lume.com", password: "Incorreta", status: 401 },
    { email: "invalido", password: "Lume@123", status: 400 },
    { email: "", password: "", status: 400 },
  ].forEach(({ status, ...body }, i) => {
    it(`API-AUT-0${41 + i} [A][E] - Rejeita credenciais ${i + 1}`, () => {
      cy.request({ method: "POST", url: url("/auth/login"), body, failOnStatusCode: false }).then((r) => errorResponse(r, status));
    });
  });
});
