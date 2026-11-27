# Resultados dos testes — Lume

Data: **24/11/2026**, America/Sao_Paulo. Ambiente: Windows 11 x64, Node 24.16.0, Cypress 16.3.0, Electron 150 headless, MongoDB temporário com replica set, API/Vite locais. Nenhum commit ou push realizado.

## Inventário implementado

**208 testes: 47 UI e 161 API**, distribuídos em 13 specs. Contagens por tag podem se sobrepor:

| Técnica UI | Quantidade |
|---|---:|
| PE | 24 |
| AVL | 21 |
| TD | 4 |
| CRUD | 3 |

| Dimensão VADER | Quantidade de testes API |
|---|---:|
| V — Verbs | 24 |
| A — Authentication/Authorization | 34 |
| D — Data | 119 |
| E — Errors | 112 |
| R — Responsiveness | 9 |

As variações de limites na API são identificadas por D. As quatro regras da tabela de decisão existem tanto na UI como na API; na API recebem V/D. A [matriz](matriz-de-cobertura.md) relaciona cada ID a cenário, oráculo, prioridade e arquivo.

## Execuções reais

| Execução | Total | Aprovados | Reprovados | Observação |
|---|---:|---:|---:|---|
| API independente | 161 | 161 | 0 | Todas as sete specs passaram |
| UI inicial | 46 | 41 | 5 | Quatro falhas de sincronização/asserção da automação; uma ocorrência do defeito de logout |
| UI após primeiro ajuste | 47 | 45 | 2 | Logout ainda reproduziu corrida; cenário controlado precisou evitar HTTP 304 do cache |
| Login isolado, após ajustes | 7 | 6 | 1 | UI-LOG-007 confirmou defeito real; seis cenários normais passaram |
| Completa 1 | 208 | 207 | 1 | API 161/161; UI 46/47; somente UI-LOG-007; duração somada das specs: 200,507 s |
| Completa 2 | 208 | 207 | 1 | Mesmo resultado; duração somada das specs: 204,234 s |

**Resultado final: 207 aprovados e 1 reprovado em cada uma das duas execuções completas; nenhum pendente ou pulado.** O resultado foi repetido sem retries. As duas execuções retornaram código de saída **1**, como esperado para a regressão aberta. Os demais 207 testes permaneceram estáveis nessas execuções; isso não prova ausência de toda instabilidade possível.

Logs locais preservados em `.cache/all-1.log` e `.cache/all-2.log`; resultados estruturados em `.cache/all-1.json` e `.cache/all-2.json`. Os arquivos correspondentes de duração têm sufixo `-timings.jsonl`. O resultado mais recente também está em `cypress/results/latest.json`. Esses artefatos locais são ignorados pelo Git; este relatório registra os números relevantes para versionamento.

As quatro falhas iniciais da automação foram: UI-CAD-005/011 dependiam de validity.tooShort não ativado pela digitação sintética; UI-CHE-002 e UI-VIP-004 liam o total antes da atualização assíncrona. A correção verifica rejeição real com 400/mensagem visível e usa `should` com retentativa nativa para os valores monetários. Não foram alterados valores esperados nem regras da aplicação.

A validação de tipos `npm run check` passou. `git diff --check` não encontrou erros de whitespace. Não há `it.only`, `it.skip`, sleeps fixos, force clicks ou supressão de exceções.

## Tempos observados

Valores de `response.duration` em milissegundos, após aquecimento. As durações abaixo são das requisições, não incluem preparação de massa nem duração total do teste.

| Endpoint | API independente | Completa 1 | Completa 2 | Referência |
|---|---:|---:|---:|---:|
| Health | 2 | 2 | 2 | 500 |
| Produtos | 4 | 3 | 7 | 1000 |
| Login | 531 | 518 | 485 | 2000 |
| Perfil (mín–máx dos três clientes) | 3–4 | 3–8 | 3–9 | 1000 |
| Carrinho | 27 | 6 | 12 | 1000 |
| Checkout, compra real após aquecimento | 49 | 32 | 36 | 3000 |

O reenvio idempotente de checkout mediu, adicionalmente, 35/23/19 ms nessas execuções. As referências não foram ampliadas. Esses resultados locais não representam testes de carga, stress nem SLAs.

## Defeito confirmado

### DEF-001 — Resposta atrasada de perfil restaura usuário após logout

- **Funcionalidade:** login/logout e estado visual da sessão.
- **Severidade sugerida:** média. O cabeçalho volta a exibir nome e ações de usuário conectado após sair. O token permanece removido; não foi demonstrado bypass de autorização no backend.
- **Caso:** `UI-LOG-007`, `cypress/e2e/ui/login.cy.js`.
- **Pré-condição:** perfil ainda em trânsito após login válido.
- **Passos:** entrar como Ana; manter pendente a resposta real de GET /api/me; clicar em Sair; confirmar ausência de `lume-token`; liberar a resposta real de perfil; verificar cabeçalho.
- **Esperado:** usuário continua desconectado; botão Entrar visível e nome ausente.
- **Obtido:** nome/estado de usuário conectado reaparecem; `[data-cy="open-login"]` não é encontrado.
- **Evidência:** teste confirmou resposta HTTP 200 e token nulo antes de falhar na asserção visual. Screenshot gerado na pasta da spec de login sob `cypress/screenshots/`, com o título UI-LOG-007 no nome. Resultados brutos incluem `displayError` e identificação do teste.
- **Causa indicada pela leitura do código:** o efeito de token em `src/main.tsx` executa `api('/me').then(setUser)` sem cancelar/descartar respostas de uma sessão encerrada. Logout remove token e usuário, mas o callback pendente ainda pode chamar setUser.
- **Reprodução controlada:** `cy.intercept` apenas segura a resposta real até a ação de logout; não fabrica corpo/status, não altera o DOM e não usa espera fixa. Cabeçalhos condicionais são retirados nesse cenário para obter resposta fresca em vez de 304.
- **Situação:** não corrigido, conforme instrução de registrar defeitos da aplicação e manter a regressão ativa. A suíte deve sair com código diferente de zero enquanto esse defeito existir.

## Arquivos entregues

Criados:

- `cypress.config.js`.
- `cypress/e2e/ui/`: cadastro, login, catálogo, carrinho, checkout e cliente VIP — seis specs.
- `cypress/e2e/api/`: health, autenticação, produtos, carrinho, checkout, perfil e rate limiting — sete specs.
- `cypress/fixtures/usuarios.json` e `endereco.json`.
- `cypress/support/e2e.js`, `commands.js`, `api.js`, `ui.js` e `environment.js`.
- `server/test-control.js`, exclusivo de NODE_ENV=test com IPC.
- `docs/estrategia-de-testes.md`, `matriz-de-cobertura.md` e este relatório.

Alterados:

- `package.json` e `package-lock.json`: Cypress fixado e scripts, preservando comandos existentes.
- `src/main.tsx`: apenas atributos data-cy.
- `server/index.js`: segredo rotacionável e carregamento condicional do controle de teste; regras de negócio preservadas.
- `.gitignore`: artefatos locais de execução.
- `README.md`: instalação, execução, portas, isolamento e links da documentação.

## Limitações e melhorias futuras

- Uma falha real de logout permanece aberta.
- Execução local em um navegador; não cobre cross-browser, dispositivos reais ou acessibilidade completa.
- `cy.type` sintético não confirma a experiência de minlength com teclado físico; a rejeição real do valor inválido é coberta pela integração UI/API.
- As métricas de duração são referências locais, não SLA, carga ou stress. Nenhum limite foi ampliado para fazer testes passarem.
- Os endpoints não documentam 405; PATCH inválido retorna 404. Campos extras são removidos pelo Zod. Esses pontos estão registrados como esclarecimentos, não defeitos inventados.
- Evoluções sugeridas: corrigir descarte de respostas após logout e executar a regressão; validar Chrome; avaliar acessibilidade e cenários de sessão expirada durante interação. CI/CD e ferramentas de relatório externas ficaram fora do escopo solicitado.

## Comandos

```bash
npm ci
npx cypress install
npm run cy:open
npm run test:api
npm run test:ui
npm run test:all
npm run check
```

O instalador npm deste ambiente bloqueou scripts de postinstall; o executável foi instalado explicitamente. A variável herdada ELECTRON_RUN_AS_NODE precisou ser removida da sessão de terminal para o Electron iniciar corretamente. Isso não altera o ambiente permanente do usuário. API e Vite são iniciados e encerrados pela configuração Cypress; não executar `npm run dev` ao mesmo tempo.
