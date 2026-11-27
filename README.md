# Lume — beleza & cuidado

E-commerce demonstrativo de cosméticos e autocuidado para portfólio pessoal. Possui site responsivo em React/TypeScript e API REST em Node.js/Express. As quatro funcionalidades são **login, cadastro, carrinho e finalização de compra**, com uma vitrine pública de três produtos.

As embalagens são ilustrações originais em CSS. Produtos, alegações das embalagens, pedidos e pagamentos são fictícios. Não há gateway de pagamentos, cobrança, envio de mercadorias ou coleta de dados de cartão.

## Requisitos e instalação

- Node.js 22.12 ou superior (validado com Node 24).
- npm e Git.
- Internet na instalação e na primeira inicialização: `mongodb-memory-server` baixa automaticamente o binário MongoDB. Não é preciso instalar MongoDB ou usar Docker.

```bash
git clone https://github.com/cintiaomaas/lume-ecommerce.git
cd lume-ecommerce
npm ci
```

## Executar

Desenvolvimento, com recarregamento do site e da API:

```bash
npm run dev
```

Site: http://127.0.0.1:5173. API: http://127.0.0.1:3000. O Vite encaminha `/api` ao backend. Aguarde a mensagem de inicialização da API antes de entrar no site; o primeiro download do MongoDB pode levar alguns minutos.

Para servir a versão compilada pelo próprio Express:

```bash
npm run build
npm start
```

Acesse http://127.0.0.1:3000. Não execute os dois modos simultaneamente na mesma porta. Encerre com `Ctrl+C`.

Verificação de tipos (não é automação de testes):

```bash
npm run check
```

As suítes automatizadas de UI e API usam Cypress. Consulte a seção abaixo para execução.

## Banco de dados em memória

O backend inicia um replica set de um nó com `MongoMemoryReplSet`, permitindo transações MongoDB. Ele é temporário: **usuários cadastrados, pedidos, alterações de estoque e carrinhos são descartados ao reiniciar o processo**. A cada inicialização, exatamente três produtos e três usuários são inseridos novamente. O binário baixado pode permanecer em cache; os dados da loja não são persistidos como um banco de produção.

## Dados de teste

Todos os usuários abaixo usam a senha **`Lume@123`**. São credenciais públicas fictícias para demonstração.

| Cliente    | E-mail         | Acumulado anterior | VIP |
| ---------- | -------------- | ------------------ | --- |
| Ana Silva  | ana@lume.com   | R$ 0,00            | Não |
| Bia Santos | bia@lume.com   | R$ 250,00          | Não |
| Clara Lima | clara@lume.com | R$ 350,00          | Sim |

Os acumulados de Bia e Clara são saldos iniciais de demonstração, sem pedidos históricos associados.

| Produto                       | Preço    | Estoque inicial |
| ----------------------------- | -------- | --------------- |
| Sérum Ilumina · 30 ml         | R$ 89,90 | 20              |
| Hidratante Abraço · 200 ml    | R$ 59,90 | 15              |
| Protetor Solar Aurora · 50 ml | R$ 79,90 | 0               |

Os IDs são gerados a cada inicialização: consulte `GET /api/products` antes de usar a API.

## Regras de negócio

1. Dinheiro concede **10% de desconto no subtotal dos produtos**, sem desconto no frete. Cartão é simulado e não concede desconto.
2. Produtos só entram no carrinho se houver estoque para a quantidade total solicitada. Cada item aceita de 1 a 99 unidades. Adicionar ao carrinho não reserva estoque.
3. O estoque é validado novamente na finalização. Baixa de estoque, criação do pedido, limpeza do carrinho e atualização do cliente ocorrem em uma única transação. Uma falha cancela a operação inteira.
4. Apenas VIP tem frete grátis. Para demais clientes, o frete fixo é **R$ 20,00 por pedido**. Carrinho vazio não tem frete.
5. Cliente torna-se VIP ao atingir **R$ 300,00** acumulados em produtos efetivamente pagos, após descontos e sem frete. O benefício começa **na próxima compra**; a compra que atinge o limite ainda usa o status anterior.
6. VIP pode acumular frete grátis com o desconto em dinheiro.
7. Valores são calculados no servidor em **centavos inteiros**. O desconto é arredondado ao centavo mais próximo.
8. Finalização exige autenticação, carrinho não vazio, endereço válido e uma chave UUID no cabeçalho `Idempotency-Key`. Reenviar a mesma chave retorna o pedido original sem nova cobrança simulada ou baixa de estoque.

## URLs importantes

| Recurso                 | URL                                    |
| ----------------------- | -------------------------------------- |
| Site em desenvolvimento | http://127.0.0.1:5173                  |
| Site compilado          | http://127.0.0.1:3000                  |
| Swagger UI interativo   | http://127.0.0.1:3000/api-docs         |
| Especificação YAML      | http://127.0.0.1:3000/api/openapi.yaml |
| Catálogo JSON           | http://127.0.0.1:3000/api/products     |
| Saúde da API            | http://127.0.0.1:3000/api/health       |

No Swagger, execute o login e copie o campo `token` para **Authorize**. Não inclua o prefixo `Bearer` nesse campo; o Swagger o adiciona. Use IDs do catálogo para montar o carrinho e um UUID novo para cada compra.

## Estrutura

```text
server/index.js   API, modelos, seed, transações e inicialização do MongoDB
src/main.tsx      Vitrine, autenticação, sacola, checkout e confirmação
src/style.css     Layout responsivo e ilustrações de produtos
openapi.yaml     Contrato OpenAPI 3.0.3
vite.config.js   Build e proxy de desenvolvimento
```

## Segurança e limites do projeto

Senhas usam bcrypt com custo 12, sessões usam JWT com validade de duas horas, entrada é validada com Zod e autenticação limita tentativas por IP. O token fica no `sessionStorage` da aba e é removido ao sair. A chave JWT é aleatória por execução; opcionalmente configure `JWT_SECRET` no ambiente do processo. `PORT` permite alterar a porta da API (ajuste também o proxy Vite caso necessário). Arquivos `.env` não são carregados automaticamente.

O servidor escuta somente em `127.0.0.1`. Este projeto é destinado a execução local: não inclui recuperação de senha, verificação de e-mail, logística ou pagamentos reais. Google Fonts é opcional; há fontes locais de fallback. Para uma implantação real, seriam necessários banco persistente, HTTPS e gestão de segredos.

## Roteiro de exploração manual

- Cadastre um cliente; confira campos obrigatórios e rejeição de e-mail duplicado.
- Entre como Ana, adicione um sérum e escolha dinheiro: subtotal R$ 89,90, desconto R$ 8,99, frete R$ 20,00, total R$ 100,91.
- Confirme o pedido e observe a sacola vazia e o estoque atualizado.
- Entre como Bia e compre um hidratante no cartão: total R$ 79,90 com frete. Seu acumulado passa a R$ 309,90 e a próxima compra tem frete grátis.
- Entre como Clara e confira frete grátis, inclusive com desconto em dinheiro.
- Confira o protetor esgotado; pela API, a tentativa de inclusão retorna HTTP 409.
- Confira o site em largura de celular e percorra os formulários com o teclado.

Esses passos são um roteiro manual, não uma suíte automatizada.

## Automação Cypress

Requisitos: Node 22.12+ em uma versão principal suportada pelo Cypress (22, 24 ou >=26), npm e o binário Cypress 16.3.0. Instale com `npm ci`. Se o npm bloquear o postinstall do Cypress, execute `npx cypress install`. Na primeira execução, MongoDB também pode precisar baixar seu binário. No PowerShell com scripts bloqueados, use `npm.cmd` e `npx.cmd`.

```bash
npm run cy:open
npm run test:api
npm run test:ui
npm run test:all
npm run check
```

Os comandos de testes iniciam automaticamente uma API de testes e o Vite e aguardam a API ficar disponível. **Encerre `npm run dev`/`npm start` antes de executar a suíte**, pois as portas precisam estar livres. Não inicie outra aplicação junto dos testes. Cada teste restaura a massa, inclusive rate limiting, estoque e saldo VIP. Não use dados reais.

Por padrão: UI `http://127.0.0.1:5173`, API `http://127.0.0.1:3000`. Exemplo PowerShell para outras portas locais:

```powershell
$env:CYPRESS_BASE_URL = 'http://127.0.0.1:5174'
$env:CYPRESS_API_URL = 'http://127.0.0.1:3001'
npm.cmd run test:all
```

A suíte recusa hosts externos. O proxy Vite acompanha a porta da API. Para ajustar apenas referências locais de tempo, use, por exemplo, `npm run test:api -- --env loginMs=2500,checkoutMs=4000`; registre a justificativa do ajuste. Os valores não são SLAs.

Para executar uma spec individual ou escolher navegador instalado:

```bash
npm run test:all -- --spec cypress/e2e/api/checkout.cy.js
npm run test:ui -- --browser chrome
```

Na interface `cy:open`, selecione uma spec. Não é necessário executar cadastro/login antes de outro teste. Falhas geram saída diferente de zero e screenshots em `cypress/screenshots`. O Electron incluído permite execução inicial sem navegador adicional, mas está depreciado pelo Cypress; Chrome é uma alternativa. Se um terminal de automação herdar `ELECTRON_RUN_AS_NODE`, remova a variável somente desse terminal antes de executar: `Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue`.

Consulte [estratégia](docs/estrategia-de-testes.md), [matriz de cobertura](docs/matriz-de-cobertura.md) e [resultados reais](docs/resultados-dos-testes.md). Resultados brutos da última execução ficam em `cypress/results/latest.json` e durações HTTP em `cypress/results/timings.jsonl`; esses arquivos locais são substituídos a cada execução.
