# Matriz de cobertura — Lume

Cada linha corresponde a um teste registrado, inclusive variações parametrizadas. Valores monetários da API estão em centavos. As tags contabilizam dimensões e podem se sobrepor. Os testes de API utilizam VADER; AVL na API está representada em D.

| ID | Camada | Funcionalidade | Técnica | Cenário | Resultado esperado | Prioridade | Arquivo |
|---|---|---|---|---|---|---|---|
| API-AUT-001 | API | autenticacao | V, A, R | Login válido, perfil público e tempo após aquecimento | 200, token válido, perfil público correto; duração <2000ms após aquecimento | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-002 | API | autenticacao | V, D, A | Cadastro normaliza dados e ignora privilégios injetados | 201; nome/e-mail normalizados; spent=0 e vip=false; sem campos sensíveis | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-003 | API | autenticacao | D, E | Cadastro: nome 1 | 400, detalhes identificam o campo inválido | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-004 | API | autenticacao | D | Cadastro: nome 2 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-005 | API | autenticacao | D | Cadastro: nome 3 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-006 | API | autenticacao | D | Cadastro: nome 79 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-007 | API | autenticacao | D | Cadastro: nome 80 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-008 | API | autenticacao | D, E | Cadastro: nome 81 | 400, detalhes identificam o campo inválido | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-009 | API | autenticacao | D, E | Cadastro: senha 7 | 400, detalhes identificam o campo inválido | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-010 | API | autenticacao | D | Cadastro: senha 8 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-011 | API | autenticacao | D | Cadastro: senha 9 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-012 | API | autenticacao | D | Cadastro: senha 71 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-013 | API | autenticacao | D | Cadastro: senha 72 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-014 | API | autenticacao | D, E | Cadastro: senha 73 | 400, detalhes identificam o campo inválido | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-015 | API | autenticacao | D, E | Cadastro: name undefined | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-016 | API | autenticacao | D, E | Cadastro: name null | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-017 | API | autenticacao | D, E | Cadastro: name  | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-018 | API | autenticacao | D, E | Cadastro: name 123 | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-019 | API | autenticacao | D, E | Cadastro: email undefined | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-020 | API | autenticacao | D, E | Cadastro: email null | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-021 | API | autenticacao | D, E | Cadastro: email  | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-022 | API | autenticacao | D, E | Cadastro: email 123 | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-023 | API | autenticacao | D, E | Cadastro: password undefined | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-024 | API | autenticacao | D, E | Cadastro: password null | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-025 | API | autenticacao | D, E | Cadastro: password  | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-026 | API | autenticacao | D, E | Cadastro: password 123 | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-027 | API | autenticacao | D, E | Cadastro: formato do e-mail | 400, mensagem e campo de validação; sem sessão | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-028 | API | autenticacao | D | Cadastro: e-mail 253 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-029 | API | autenticacao | D | Cadastro: e-mail 254 | 201, sessão válida e acumulado zero | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-030 | API | autenticacao | D, E | Cadastro: e-mail 255 | 400, detalhes identificam o campo inválido | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-040 | API | autenticacao | D, E | E-mail duplicado retorna conflito | 409, mensagem de registro existente | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-041 | API | autenticacao | A, E | Rejeita credenciais 1 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-042 | API | autenticacao | A, E | Rejeita credenciais 2 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-043 | API | autenticacao | A, E | Rejeita credenciais 3 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-AUT-044 | API | autenticacao | A, E | Rejeita credenciais 4 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/api/autenticacao.cy.js) |
| API-CAR-001 | API | carrinho | V, D, R | PUT absoluto idempotente, leitura, atualização e exclusão | Uma linha com quantidade 2 após dois PUTs; total 19980; atualização 1, exclusão e nova adição | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-002 | API | carrinho | D, E | Quantidade -1: HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-003 | API | carrinho | D, E | Quantidade 0: HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-004 | API | carrinho | D | Quantidade 1: HTTP 200 | HTTP 200; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-005 | API | carrinho | D | Quantidade 2: HTTP 200 | HTTP 200; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-006 | API | carrinho | D | Quantidade 19: HTTP 200 | HTTP 200; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-007 | API | carrinho | D | Quantidade 20: HTTP 200 | HTTP 200; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-008 | API | carrinho | D, E | Quantidade 21: HTTP 409 | HTTP 409; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-009 | API | carrinho | D, E | Quantidade 98: HTTP 409 | HTTP 409; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-010 | API | carrinho | D, E | Quantidade 99: HTTP 409 | HTTP 409; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-011 | API | carrinho | D, E | Quantidade 100: HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-012 | API | carrinho | D, E | Quantidade 1.5: HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-013 | API | carrinho | D, E | Quantidade "1": HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-014 | API | carrinho | D, E | Quantidade null: HTTP 400 | HTTP 400; validação 400 distinta de estoque 409; sucesso reflete quantidade absoluta | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-020 | API | carrinho | D | Limite contratual 98 com estoque controlado | 200; quantidade 98/99 aceita com estoque de teste 99 | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-021 | API | carrinho | D | Limite contratual 99 com estoque controlado | 200; quantidade 98/99 aceita com estoque de teste 99 | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-022 | API | carrinho | D, E | Identificador inválido ou inexistente 1 | 400 para malformado/nulo/ausente; 409 para ObjectId inexistente | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-023 | API | carrinho | D, E | Identificador inválido ou inexistente 2 | 400 para malformado/nulo/ausente; 409 para ObjectId inexistente | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-024 | API | carrinho | D, E | Identificador inválido ou inexistente 3 | 400 para malformado/nulo/ausente; 409 para ObjectId inexistente | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-025 | API | carrinho | D, E | Identificador inválido ou inexistente 4 | 400 para malformado/nulo/ausente; 409 para ObjectId inexistente | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CAR-026 | API | carrinho | D, E | Produto esgotado e pagamento inválido | 409 ao adicionar esgotado; 400 para pagamento inválido; carrinho vazio | P1 | [spec](../cypress/e2e/api/carrinho.cy.js) |
| API-CHE-001 | API | checkout | V, D | R01: ana, card, integridade da compra | Subtotal 8990; desconto 0; frete 2000; total 10990; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-002 | API | checkout | V, D | R02: ana, cash, integridade da compra | Subtotal 8990; desconto 899; frete 2000; total 10091; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-003 | API | checkout | V, D | R03: clara, card, integridade da compra | Subtotal 8990; desconto 0; frete 0; total 8990; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-004 | API | checkout | V, D | R04: clara, cash, integridade da compra | Subtotal 8990; desconto 899; frete 0; total 8091; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-005 | API | checkout | D, R | Idempotência preserva pedido, estoque e acumulado; nova chave compra novamente | Mesmo pedido e uma baixa; nova chave cria novo pedido; estoque 18 e acumulado 17980 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-010 | API | checkout | D, E | Rejeita pagamento ausente sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-011 | API | checkout | D, E | Rejeita pagamento desconhecido sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-012 | API | checkout | D, E | Rejeita pagamento nulo sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-013 | API | checkout | D, E | Rejeita endereço ausente sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-014 | API | checkout | D, E | Rejeita endereço nulo sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-015 | API | checkout | D, E | Rejeita recipient: undefined sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-016 | API | checkout | D, E | Rejeita recipient:  sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-017 | API | checkout | D, E | Rejeita recipient: null sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-018 | API | checkout | D, E | Rejeita recipient: 123 sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-019 | API | checkout | D, E | Rejeita street: undefined sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-020 | API | checkout | D, E | Rejeita street:  sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-021 | API | checkout | D, E | Rejeita street: null sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-022 | API | checkout | D, E | Rejeita street: 123 sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-023 | API | checkout | D, E | Rejeita city: undefined sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-024 | API | checkout | D, E | Rejeita city:  sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-025 | API | checkout | D, E | Rejeita city: null sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-026 | API | checkout | D, E | Rejeita city: 123 sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-027 | API | checkout | D, E | Rejeita state: undefined sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-028 | API | checkout | D, E | Rejeita state:  sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-029 | API | checkout | D, E | Rejeita state: null sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-030 | API | checkout | D, E | Rejeita state: 123 sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-031 | API | checkout | D, E | Rejeita zip: undefined sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-032 | API | checkout | D, E | Rejeita zip:  sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-033 | API | checkout | D, E | Rejeita zip: null sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-034 | API | checkout | D, E | Rejeita zip: 123 sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-035 | API | checkout | D, E | Rejeita UF minúscula sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-036 | API | checkout | D, E | Rejeita UF longa sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-037 | API | checkout | D, E | Rejeita CEP curto sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-038 | API | checkout | D, E | Rejeita CEP longo sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-039 | API | checkout | D, E | Rejeita CEP alfabético sem efeitos parciais | 400; carrinho com 1 item, estoque 20, acumulado 0 e não VIP preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-050 | API | checkout | D, E | Endereço recipient com 1 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-051 | API | checkout | D | Endereço recipient com 2 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-052 | API | checkout | D | Endereço recipient com 3 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-053 | API | checkout | D | Endereço recipient com 79 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-054 | API | checkout | D | Endereço recipient com 80 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-055 | API | checkout | D, E | Endereço recipient com 81 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-056 | API | checkout | D, E | Endereço street com 2 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-057 | API | checkout | D | Endereço street com 3 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-058 | API | checkout | D | Endereço street com 4 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-059 | API | checkout | D | Endereço street com 159 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-060 | API | checkout | D | Endereço street com 160 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-061 | API | checkout | D, E | Endereço street com 161 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-062 | API | checkout | D, E | Endereço city com 1 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-063 | API | checkout | D | Endereço city com 2 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-064 | API | checkout | D | Endereço city com 3 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-065 | API | checkout | D | Endereço city com 79 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-066 | API | checkout | D | Endereço city com 80 caracteres | 201, endereço dentro do limite aceito | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-067 | API | checkout | D, E | Endereço city com 81 caracteres | 400, campo fora do limite rejeitado | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-070 | API | checkout | D, E | Chave ausente | 400; carrinho e acumulado preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-071 | API | checkout | D, E | Chave inválida | 400; carrinho e acumulado preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-072 | API | checkout | D, E | Carrinho vazio rejeitado | 400, Seu carrinho está vazio; saldo zero | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-073 | API | checkout | A, D | Ignora totais injetados e aceita CEP sem hífen | Total 10091, desconto 899, frete 2000; saldo 8091, não VIP | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-074 | API | checkout | D | Arredonda desconto de meio centavo com produto exclusivo QA | Subtotal 10005; desconto 1001; frete 2000; total 11004; acumulado 9004 | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-075 | API | checkout | D | Transição VIP ao atingir 29999 centavos | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-076 | API | checkout | D | Transição VIP ao atingir 30000 centavos | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-077 | API | checkout | D | Transição VIP ao atingir 30001 centavos | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-078 | API | checkout | D, E | Segundo cliente perde estoque e transação reverte inclusive item anterior | 409; item anterior revertido, estoque 15/1, carrinho e perfil do perdedor preservados | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-079 | API | checkout | D, E | Concorrência real permite somente um comprador do último estoque | Um 201 e um 409; estoque zero; apenas vencedor acumula e esvazia carrinho | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-CHE-080 | API | checkout | R | Mede compra real após aquecer transação de checkout | Compra real após aquecimento com duração <3000ms | P0 | [spec](../cypress/e2e/api/checkout.cy.js) |
| API-HEA-001 | API | health | V, A, R | Health público após aquecimento | 200, status ok, duração <500ms após aquecimento | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-002 | API | health | V, A | Publica contrato OpenAPI | 200, content-type YAML e OpenAPI 3.0.3 | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-003 | API | health | V, E | PATCH /inexistente não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-004 | API | health | V, E | PATCH /health não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-005 | API | health | V, E | PATCH /products não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-006 | API | health | V, E | PATCH /me não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-007 | API | health | V, E | PATCH /cart não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-008 | API | health | V, E | PATCH /cart/items não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-009 | API | health | V, E | PATCH /cart/items/abc não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-010 | API | health | V, E | PATCH /checkout não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-011 | API | health | V, E | PATCH /auth/login não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-012 | API | health | V, E | PATCH /auth/register não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-013 | API | health | V, E | PATCH /openapi.yaml não é suportado | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-014 | API | health | E | GET de endpoint inexistente retorna 404 | 404, mensagem de endpoint não encontrado; seed preservado | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-HEA-015 | API | health | E | JSON malformado é rejeitado sem stack trace | 400 com mensagem, sem stack/password/token | P2 | [spec](../cypress/e2e/api/health.cy.js) |
| API-PER-001 | API | perfil | V, A, D, R | Perfil ana e referência de tempo | 200; Ana 0/não VIP, Bia 25000/não VIP, Clara 35000/VIP; apenas campos públicos e duração <1000ms | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-002 | API | perfil | V, A, D, R | Perfil bia e referência de tempo | 200; Ana 0/não VIP, Bia 25000/não VIP, Clara 35000/VIP; apenas campos públicos e duração <1000ms | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-003 | API | perfil | V, A, D, R | Perfil clara e referência de tempo | 200; Ana 0/não VIP, Bia 25000/não VIP, Clara 35000/VIP; apenas campos públicos e duração <1000ms | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-010 | API | perfil | A, E | GET /me: token ausente | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-011 | API | perfil | A, E | GET /me: token inválido | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-012 | API | perfil | A, E | GET /me: token malformado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-013 | API | perfil | A, E | GET /me: token expirado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-014 | API | perfil | A, E | GET /cart: token ausente | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-015 | API | perfil | A, E | GET /cart: token inválido | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-016 | API | perfil | A, E | GET /cart: token malformado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-017 | API | perfil | A, E | GET /cart: token expirado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-018 | API | perfil | A, E | PUT /cart/items: token ausente | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-019 | API | perfil | A, E | PUT /cart/items: token inválido | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-020 | API | perfil | A, E | PUT /cart/items: token malformado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-021 | API | perfil | A, E | PUT /cart/items: token expirado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-022 | API | perfil | A, E | DELETE /cart/items/abc: token ausente | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-023 | API | perfil | A, E | DELETE /cart/items/abc: token inválido | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-024 | API | perfil | A, E | DELETE /cart/items/abc: token malformado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-025 | API | perfil | A, E | DELETE /cart/items/abc: token expirado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-026 | API | perfil | A, E | POST /checkout: token ausente | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-027 | API | perfil | A, E | POST /checkout: token inválido | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-028 | API | perfil | A, E | POST /checkout: token malformado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-029 | API | perfil | A, E | POST /checkout: token expirado | 401, sessão expirada; operação protegida não executada | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PER-030 | API | perfil | A, D | Carrinhos isolados e userId enviado não muda proprietário | Operações afetam somente o usuário do token; carrinho alheio não é removido | P0 | [spec](../cypress/e2e/api/perfil.cy.js) |
| API-PRO-001 | API | produtos | V, A, D, R | Catálogo público contém preços e estoques do seed | Três produtos oficiais, preços inteiros e estoques 20/15/0; duração <1000ms | P1 | [spec](../cypress/e2e/api/produtos.cy.js) |
| API-RAT-001 | API | rate-limit | E | Permite 50 tentativas e bloqueia a 51ª | Tentativas 1–50: 401; tentativa 51: 429 e mensagem de limite | P1 | [spec](../cypress/e2e/api/rate-limit.cy.js) |
| UI-CAD-001 | UI | cadastro | PE | Cadastro válido inicia sessão | 201; nome visível e token no sessionStorage | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-002 | UI | cadastro | PE | Campos obrigatórios vazios bloqueiam envio | HTML valueMissing nos campos obrigatórios; envio bloqueado | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-003 | UI | cadastro | PE | Formato de e-mail inválido | HTML typeMismatch bloqueia envio | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-004 | UI | cadastro | PE | E-mail duplicado apresenta conflito | Conflito visível; cadastro permanece aberto | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-005 | UI | cadastro | AVL | name com 1 caracteres | minlength presente; API rejeita entrada sintética com 400; mensagem na tela e sem sessão | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-006 | UI | cadastro | AVL | name com 2 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-007 | UI | cadastro | AVL | name com 3 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-008 | UI | cadastro | AVL | name com 79 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-009 | UI | cadastro | AVL | name com 80 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-010 | UI | cadastro | AVL | name com 81 caracteres | UI limita digitação a 80; cadastro do valor truncado retorna 201 | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-011 | UI | cadastro | AVL | password com 7 caracteres | minlength presente; API rejeita entrada sintética com 400; mensagem na tela e sem sessão | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-012 | UI | cadastro | AVL | password com 8 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-013 | UI | cadastro | AVL | password com 9 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-014 | UI | cadastro | AVL | password com 71 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-015 | UI | cadastro | AVL | password com 72 caracteres | 201; cadastro válido e usuário visível | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAD-016 | UI | cadastro | AVL | password com 73 caracteres | UI limita digitação a 72; cadastro do valor truncado retorna 201 | P1 | [spec](../cypress/e2e/ui/cadastro.cy.js) |
| UI-CAR-001 | UI | carrinho | CRUD | Adiciona, consulta, aumenta, diminui, remove e adiciona novamente | Carrinho 1 → 2 → 1 → vazio → 1, sem duplicar linhas | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-002 | UI | carrinho | CRUD | Dois produtos persistem ao recarregar a mesma aba | Sérum e hidratante persistem na mesma aba; remover sérum preserva hidratante | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-003 | UI | carrinho | AVL | Quantidade 1 e limite de estoque | Quantidade exibida; aumento permitido abaixo de 20, botão desabilitado em 20 | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-004 | UI | carrinho | AVL | Quantidade 2 e limite de estoque | Quantidade exibida; aumento permitido abaixo de 20, botão desabilitado em 20 | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-005 | UI | carrinho | AVL | Quantidade 19 e limite de estoque | Quantidade exibida; aumento permitido abaixo de 20, botão desabilitado em 20 | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-006 | UI | carrinho | AVL | Quantidade 20 e limite de estoque | Quantidade exibida; aumento permitido abaixo de 20, botão desabilitado em 20 | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-007 | UI | carrinho | AVL, CRUD | Diminuir abaixo de 1 remove o último item | Último item removido; estado vazio; sem botão de checkout | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAR-008 | UI | carrinho | AVL | Nova adição de 21ª unidade apresenta erro de estoque | Erro de estoque visível; quantidade 20 preservada | P1 | [spec](../cypress/e2e/ui/carrinho.cy.js) |
| UI-CAT-001 | UI | catalogo | PE | Exibe Sérum Ilumina, preço e disponibilidade | Nome e preço oficiais; disponíveis habilitados, protetor esgotado desabilitado | P1 | [spec](../cypress/e2e/ui/catalogo.cy.js) |
| UI-CAT-002 | UI | catalogo | PE | Exibe Hidratante Abraço, preço e disponibilidade | Nome e preço oficiais; disponíveis habilitados, protetor esgotado desabilitado | P1 | [spec](../cypress/e2e/ui/catalogo.cy.js) |
| UI-CAT-003 | UI | catalogo | PE | Exibe Protetor Solar Aurora, preço e disponibilidade | Nome e preço oficiais; disponíveis habilitados, protetor esgotado desabilitado | P1 | [spec](../cypress/e2e/ui/catalogo.cy.js) |
| UI-CHE-001 | UI | checkout | TD, PE | R01: ana paga com card | Subtotal 8990; desconto 0; frete 2000; total 10990; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-002 | UI | checkout | TD, PE | R02: ana paga com cash | Subtotal 8990; desconto 899; frete 2000; total 10091; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-003 | UI | checkout | TD, PE | R03: clara paga com card | Subtotal 8990; desconto 0; frete 0; total 8990; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-004 | UI | checkout | TD, PE | R04: clara paga com cash | Subtotal 8990; desconto 899; frete 0; total 8091; confirmação, carrinho vazio e estoque 19 | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-005 | UI | checkout | PE | Endereço incompleto e campos obrigatórios | HTML valueMissing nos campos obrigatórios; envio bloqueado | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-006 | UI | checkout | PE | CEP inválido bloqueia confirmação | HTML patternMismatch bloqueia envio e confirmação | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-007 | UI | checkout | PE | Carrinho vazio não permite abrir checkout | Estado vazio visível, ação de checkout ausente | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-008 | UI | checkout | PE | Sem sessão, sacola solicita autenticação | Formulário de login visível; sem acesso ao checkout | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-CHE-009 | UI | checkout | PE | Outro comprador esgota o produto antes da confirmação | Erro de estoque visível, sem confirmação e carrinho preservado | P0 | [spec](../cypress/e2e/ui/checkout.cy.js) |
| UI-VIP-001 | UI | cliente-vip | AVL | Compra atinge 29999 centavos; benefício começa na próxima | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P1 | [spec](../cypress/e2e/ui/cliente-vip.cy.js) |
| UI-VIP-002 | UI | cliente-vip | AVL | Compra atinge 30000 centavos; benefício começa na próxima | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P1 | [spec](../cypress/e2e/ui/cliente-vip.cy.js) |
| UI-VIP-003 | UI | cliente-vip | AVL | Compra atinge 30001 centavos; benefício começa na próxima | Frete 2000 na transição; saldo exato; VIP apenas >=30000; próxima sacola sem frete somente para VIP | P1 | [spec](../cypress/e2e/ui/cliente-vip.cy.js) |
| UI-VIP-004 | UI | cliente-vip | PE | Bia ultrapassa limite com dinheiro, acumulando após desconto e sem frete | Saldo 33091 e VIP; frete da compra 2000; desconto 899 e total 10091 | P1 | [spec](../cypress/e2e/ui/cliente-vip.cy.js) |
| UI-LOG-001 | UI | login | PE | Login válido e logout limpam a sessão visual e local | Nome visível após login; logout remove token e usuário; sacola exige novo login | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-002 | UI | login | PE | Credenciais inválidas 1 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-003 | UI | login | PE | Credenciais inválidas 2 | Credenciais inexistentes/incorretas: 401; formato/vazio: 400 na API; UI sem sessão e com erro | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-004 | UI | login | PE | E-mail inválido bloqueado pelo navegador | HTML typeMismatch bloqueia envio | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-005 | UI | login | PE | Campos obrigatórios bloqueiam envio | HTML valueMissing nos campos obrigatórios; envio bloqueado | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-006 | UI | login | PE | Adicionar sem autenticação solicita login | Formulário de login visível; sem acesso ao checkout | P1 | [spec](../cypress/e2e/ui/login.cy.js) |
| UI-LOG-007 | UI | login | PE | Logout permanece efetivo quando o perfil chega depois de sair | Após logout e chegada tardia de /me: token ausente, usuário ausente e botão Entrar visível | P1 | [spec](../cypress/e2e/ui/login.cy.js) |

## Endpoints × VADER

| Endpoint | V | A | D | E | R |
|---|---|---|---|---|---|
| GET /health | HEA-001,004 | Público | status ok | PATCH 404 | HEA-001 |
| POST /auth/register | AUT-002; HEA-012 | Sessão, injeção VIP | AUT-003–030 | 400/409/429 | N/A: não é referência de tempo solicitada |
| POST /auth/login | AUT-001; HEA-011 | AUT-001,041–044 | Credenciais | 400/401/429 | AUT-001 |
| GET /me | PER-001–003; HEA-006 | PER-010–013 | Perfil/saldo/VIP | 401 | PER-001–003 |
| GET /products | PRO-001; HEA-005 | Público | Seed e centavos | PATCH 404 | PRO-001 |
| GET /cart | CAR-001; HEA-007 | PER-014–017,030 | CAR-001,026 | 400/401 | CAR-001 |
| PUT /cart/items | CAR-001; HEA-008 | PER-018–021,030 | CAR-002–026 | 400/401/409 | N/A: referência mede consulta do carrinho |
| DELETE /cart/items/:id | CAR-001; HEA-009 | PER-022–025,030 | Remoção | 401; PATCH 404 | N/A: referência mede consulta do carrinho |
| POST /checkout | CHE-001–004; HEA-010 | PER-026–029; CHE-073 | CHE-001–080 | 400/401/409 | CHE-080 |
| GET /openapi.yaml | HEA-002,013 | Público | YAML 3.0.3 | PATCH 404 | N/A: sem referência solicitada |

Prefixos da tabela são API-. V inclui método suportado e PATCH indevido; A em rotas públicas significa acesso sem token, não bloqueio de acesso. Não há corpo de entrada para health/produtos/contrato; partições de entrada nesses GETs não se aplicam. Rate limiting é aplicável somente a cadastro/login e exercitado pela rota de login em RAT-001 (middleware compartilhado).

## Tabela de decisão completa

| Regra | VIP antes da compra | Pagamento | Subtotal | Desconto | Frete | Total | Casos |
|---|---|---|---:|---:|---:|---:|---|
| R01 | Não | card | 8990 | 0 | 2000 | 10990 | UI-CHE-001 / API-CHE-001 |
| R02 | Não | cash | 8990 | 899 | 2000 | 10091 | UI-CHE-002 / API-CHE-002 |
| R03 | Sim | card | 8990 | 0 | 0 | 8990 | UI-CHE-003 / API-CHE-003 |
| R04 | Sim | cash | 8990 | 899 | 0 | 8091 | UI-CHE-004 / API-CHE-004 |

CRUD cobre somente carrinho (UI-CAR-001/002/007 e API-CAR-001). Não existem operações públicas de edição/exclusão de perfil nem CRUD de produtos. Consulte a estratégia para limitações e pontos de esclarecimento.
