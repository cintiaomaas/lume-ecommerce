# Estratégia de testes — Lume

## Objetivo e referências

Validar a integração real entre React, API Express e MongoDB temporário, com foco em dinheiro, estoque, identidade e integridade das transações. Os oráculos são `README.md` e `openapi.yaml`, comparados com `server/index.js`, `src/main.tsx`, `src/style.css`, `package.json` e `vite.config.js` antes da implementação.

O projeto exige Node >=22.12. A execução desta entrega usa Node 24.16.0 e Cypress 16.3.0 fixado no lockfile. A compatibilidade foi conferida no registro npm e na [documentação oficial de instalação](https://docs.cypress.io/app/get-started/install-cypress). Cypress 16 usa `Cypress.expose()` para configuração pública no navegador; credenciais reais nunca devem ser expostas por esse mecanismo.

## Regras e análise inicial

| Área | Regra / observação |
|---|---|
| Cadastro | Nome após trim: 2–80; senha: 8–72; e-mail: formato válido e até 254. E-mail normalizado com trim e minúsculas. Cadastro retorna sessão, HTTP 201. |
| Autenticação | JWT de duas horas, perfil sem senha; 50 tentativas por IP a cada 15 minutos. HTTP 400 para formato inválido e 401 para credenciais incorretas. |
| Catálogo | Sérum 8990 centavos / 20 unidades; hidratante 5990 / 15; protetor 7990 / 0. Público. IDs gerados pelo MongoDB. |
| Carrinho | Quantidade inteira 1–99, limitada também pelo estoque. PUT substitui a quantidade; não reserva estoque. DELETE remove item. Carrinho pertence ao usuário do token. |
| UI | Usa sessionStorage; recarregar a mesma aba mantém sessão. Diminuir de 1 para 0 remove o item. Aumentar é desabilitado no limite do estoque. Nova adição pelo catálogo ainda pode retornar erro de estoque. |
| Checkout | Endereço obrigatório: destinatário 2–80, rua 3–160, cidade 2–80, UF duas maiúsculas, CEP oito números com hífen opcional. Pagamento cash/card e chave UUID obrigatórios. |
| Financeiro | Inteiros em centavos. Dinheiro desconta 10% dos produtos, arredondado ao centavo. Frete 2000 para não VIP; vazio sem frete. Totais enviados pelo cliente são ignorados. |
| VIP | Acumulado inclui apenas produtos pagos após descontos. VIP a partir de 30000; frete gratuito somente na compra seguinte à transição. |
| Transação | Estoque, pedido, acumulado e limpeza do carrinho são atômicos. Repetição de chave recupera pedido original. |

As mensagens principais são verificadas literalmente: “Confira os campos informados.”, “E-mail ou senha incorretos.”, “Sua sessão expirou. Entre novamente.”, “Seu carrinho está vazio.” e mensagens de estoque/conflito. A confirmação visual esperada é “Pedido confirmado!”.

## Escopo e prioridade

P0: autorização, isolamento, cálculos, estoque, idempotência e rollback. P1: cadastro, limites, carrinho, VIP e tratamento de erros. P2: disponibilidade do contrato e tempos locais. Catálogo e autenticação são pré-condições para carrinho; carrinho e endereço são pré-condições para checkout; pedidos alteram estoque e acumulado.

Não há alteração de regra de negócio. Foram acrescentados somente seletores no frontend e um ponto de integração condicional para o controle de testes no backend.

## Técnicas

- **PE:** dados válidos/inválidos, credenciais, disponibilidade, campos obrigatórios, CEP e acesso sem sessão.
- **AVL:** vizinhança dos limites de nome e senha; quantidades 1, 2, 19, 20 e tentativa 21; transição VIP 29999, 30000 e 30001. API complementa limites que o maxlength da UI impede digitar.
- **TD:** quatro combinações VIP × pagamento, com subtotal, desconto, frete e total explícitos.
- **CRUD:** exclusivamente carrinho: adicionar, ler, substituir quantidade e remover. Não há exclusão de conta, atualização de perfil nem cadastro público de produto.
- **VADER:** métodos e idempotência (V), autenticação e isolamento (A), entrada e regras (D), respostas de erro (E), duração de respostas após aquecimento (R). Tags e IDs aparecem nos títulos.

## Massa, reset e segurança do ambiente

`cypress/support/environment.js` inicia uma API filha via `fork` e Vite local. Aguarda o sinal de prontidão depois da inicialização do MongoDB, instalação do controle IPC e consulta real ao health. Não é necessário iniciar `npm run dev` junto. Portas ocupadas causam erro, para evitar operar sobre outra aplicação. URLs podem ser sobrescritas, mas a suíte destrutiva aceita apenas HTTP em 127.0.0.1. Execuções simultâneas precisam de pares de portas distintos.

`server/test-control.js` só é importado quando `NODE_ENV=test` **e** existe canal IPC. Não existem endpoints HTTP de reset. Antes de **cada teste**, o reset restaura snapshots do seed, exclui pedidos, restaura estoque, carrinhos, acumulados e credenciais, limpa o rate limiter do IP local e gira o segredo JWT. Não há `cy.session`; sessões salvas são limpas preventivamente. Cadastro usa e-mails UUID. IDs de produto são obtidos por GET /products.

A preparação controlada permite apenas: saldo fictício de Ana, estoque 99 do sérum e produto adicional QA de 10005 centavos para observar arredondamento de meio centavo. Os preços oficiais não são alterados. O saldo inicial da transição VIP é o alvo menos uma unidade de sérum; a compra real deve atingir o alvo. O produto QA e toda preparação desaparecem no próximo reset. O teste de token expirado usa o segredo atual apenas dentro do backend; testes positivos usam login real.

O rate limiting fica em spec próprio e continua ativo com limite original. Um novo reset evita contaminação da próxima spec. A concorrência usa `Promise.all` de fetch em uma task Node; não mistura Promises com comandos Cypress.

## Organização, estabilidade e manutenção

- UI e API possuem specs separadas, fixtures pequenas e suporte compartilhado apenas para operações repetidas.
- `cy.intercept` acompanha tráfego real; não substitui respostas. Não há sleeps fixos, cliques forçados, retries extras, tratamento global para ignorar exceções ou testes pulados.
- `data-cy` identifica elementos funcionais; classes de aparência não são usadas nos testes.
- Valores financeiros esperados são explícitos; os testes não copiam a fórmula do backend.
- Capturas de falhas ficam em `cypress/screenshots`. Resultados brutos e tempos ficam em `cypress/results`, ignorados pelo Git. O relatório versionado registra resultados efetivamente observados.
- Para uma nova regra, atualizar contrato/oráculo, teste, matriz e resultados. Manter IDs existentes e criar IDs únicos; lacunas numéricas são intencionais.
- Não executar contra produção. Não adicionar mocks aos fluxos principais nem ajustar expectativas para ocultar defeitos.

## Tempos e limitações

Referências locais configuráveis: health 500 ms; catálogo, perfil e carrinho 1000 ms; login 2000 ms; checkout 3000 ms. Os endpoints são aquecidos por requisição anterior; login inclui bcrypt e compra inclui transação real. O reset reutiliza o hash do seed para não medir criação de massa. As medições usam `response.duration`, registradas por task. São observações locais, não SLA, carga ou stress.

Fora do escopo: pagamentos reais, logística, recuperação de senha, acessibilidade completa, navegadores/dispositivos múltiplos e pipelines. A UI não permite envio acima de maxlength nem checkout vazio/sem sessão; a API complementa essas restrições. A execução padrão usa Electron empacotado, atualmente depreciado pelo Cypress; migrar para Chrome pode ser feito com `--browser chrome`.

A digitação sintética de `cy.type` não ativou `validity.tooShort` nesta execução. Os testes de limites inferiores verificam o atributo minlength, o HTTP 400 real e a mensagem de erro na UI, sem manipular o DOM. A experiência da validação nativa minlength com teclado físico não foi validada por esses testes.

## Pontos de esclarecimento do contrato

- Métodos não registrados retornam 404 pelo fallback Express; o OpenAPI não especifica 405. A suíte registra 404, sem inventar requisito de 405. PATCH é o método indevido exercitado por rota; isso não pretende enumerar todo o espaço de verbos HTTP.
- OpenAPI não define rejeição de campos extras. Zod remove esses campos; testes verificam que não concedem VIP nem alteram totais/proprietário.
- DELETE aceita ID como string livre no contrato e remover item ausente é operação sem efeito. Não se presume validação de ObjectId nessa rota.
- A chave idempotente retorna pedido original; comportamento com payload diferente sob a mesma chave não está especificado e não recebeu expectativa inventada.
- Login tem validação HTML de senha mínima; política de logout é remoção local do token, não revogação central. Não há endpoint de logout.

Defeitos confirmados e evidências da execução são registrados em `resultados-dos-testes.md`.
