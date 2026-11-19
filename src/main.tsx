import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type User = { name: string; email: string; spent: number; vip: boolean };
type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  kind: string;
  volume: string;
};
type Item = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  kind: string;
  quantity: number;
};
type Cart = {
  items: Item[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};
type Order = Cart & { _id: string };
const money = (n: number) =>
  (n / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const empty: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
};
function Bottle({ kind, large = false }: { kind: string; large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`bottle ${kind} ${large ? "large" : ""}`}
    >
      <div className="cap" />
      <div className="bottle-body">
        <span className="bottle-brand">
          lume<span>✳</span>
        </span>
        <span className="bottle-rule" />
        <span className="bottle-name">
          {kind === "serum"
            ? "ilumina"
            : kind === "cream"
              ? "abraço"
              : "aurora"}
        </span>
        <small>
          {kind === "serum"
            ? "SÉRUM FACIAL"
            : kind === "cream"
              ? "HIDRATANTE CORPORAL"
              : "PROTETOR SOLAR"}
        </small>
        <span className="bottle-bottom">beleza em cada pausa</span>
      </div>
    </div>
  );
}
function App() {
  const [token, setToken] = useState(
    sessionStorage.getItem("lume-token") || "",
  );
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>(empty);
  const [panel, setPanel] = useState<
    "login" | "register" | "cart" | "checkout" | "success" | null
  >(null);
  const [payment, setPayment] = useState("card");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const key = useRef("");
  const modal = useRef<HTMLDialogElement>(null);
  async function api(url: string, options: RequestInit = {}) {
    const response = await fetch(`/api${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && token) {
        sessionStorage.removeItem("lume-token");
        setToken("");
        setUser(null);
        setCart(empty);
      }
      throw Error(data.message || "Não foi possível concluir.");
    }
    return data;
  }
  async function loadProducts() {
    setProducts(await api("/products"));
  }
  useEffect(() => {
    loadProducts()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (token)
      api("/me")
        .then(setUser)
        .catch((e) => setError(e.message));
  }, [token]);
  useEffect(() => {
    if (token)
      api(`/cart?payment=${payment}`)
        .then(setCart)
        .catch((e) => setError(e.message));
  }, [token, payment, panel]);
  useEffect(() => {
    if (panel) modal.current?.showModal();
    else modal.current?.close();
  }, [panel]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  function open(next: typeof panel) {
    setError("");
    setPanel(next);
  }
  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocorreu um erro.");
    } finally {
      setBusy(false);
    }
  }
  async function quantity(productId: string, amount: number) {
    await action(async () => {
      await api(amount ? "/cart/items" : `/cart/items/${productId}`, {
        method: amount ? "PUT" : "DELETE",
        ...(amount
          ? { body: JSON.stringify({ productId, quantity: amount }) }
          : {}),
      });
      setCart(await api(`/cart?payment=${payment}`));
      key.current = "";
    });
  }
  function add(p: Product) {
    if (!user) {
      open("login");
      return;
    }
    action(async () => {
      const current: Cart = await api("/cart");
      await api("/cart/items", {
        method: "PUT",
        body: JSON.stringify({
          productId: p._id,
          quantity:
            (current.items.find((i) => i.productId === p._id)?.quantity || 0) +
            1,
        }),
      });
      setCart(await api(`/cart?payment=${payment}`));
      key.current = "";
      setToast(`${p.name} adicionado ao carrinho`);
    });
  }
  function totals() {
    return (
      <div className="totals">
        <div>
          <span>Subtotal</span>
          <span>{money(cart.subtotal)}</span>
        </div>
        {payment === "cash" && (
          <div className="discount">
            <span>Desconto em dinheiro · 10%</span>
            <span>− {money(cart.discount)}</span>
          </div>
        )}
        <div>
          <span>Frete{user?.vip ? " VIP" : ""}</span>
          <span>{cart.shipping ? money(cart.shipping) : "Grátis"}</span>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>{money(cart.total)}</strong>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="announcement">
        Um cuidado a mais:{" "}
        <strong>10% de desconto no pagamento em dinheiro</strong>
      </div>
      <header>
        <a className="logo" href="#">
          lume<span>✳</span>
          <small>BELEZA & CUIDADO</small>
        </a>
        <nav>
          <a href="#produtos">Nossos produtos</a>
          <a href="#clube">Clube Lume</a>
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <button
                onClick={() => {
                  setToken("");
                  setUser(null);
                  setCart(empty);
                  sessionStorage.removeItem("lume-token");
                }}
              >
                Sair
              </button>
              <span className="user-name">
                Olá, {user.name.split(" ")[0]} {user.vip && "✧ VIP"}
              </span>
            </>
          ) : (
            <button onClick={() => open("login")}>
              Entrar <span aria-hidden="true">♙</span>
            </button>
          )}
          <button
            className="bag-button"
            onClick={() => open(user ? "cart" : "login")}
          >
            Sacola <span>{cart.items.reduce((n, i) => n + i.quantity, 0)}</span>
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">SEU RITUAL, SEU MOMENTO</span>
            <h1>
              Uma pausa.
              <br />
              Um cuidado.
              <br />
              <em>Mais você.</em>
            </h1>
            <p>
              Pequenos rituais que fazem bem.
              <br />
              Descubra o carinho de cuidar de si, todos os dias.
            </p>
            <a className="primary link-button" href="#produtos">
              Encontre seu cuidado
            </a>
            <div className="hero-note">
              <span>✳</span> Beleza para viver no seu tempo.
            </div>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="Embalagens ilustradas do sérum Ilumina e do hidratante Abraço"
          >
            <div className="halo" />
            <span className="art-word">floresça.</span>
            <div className="pedestal" />
            <div className="hero-serum">
              <Bottle kind="serum" large />
            </div>
            <div className="hero-cream">
              <Bottle kind="cream" large />
            </div>
            <span className="art-star">✳</span>
            <div className="art-sticker">
              seu momento
              <br />
              <strong>de brilhar</strong>
            </div>
            <span className="art-caption">O ESSENCIAL É CUIDAR DE VOCÊ.</span>
          </div>
        </section>
        <div className="benefits">
          <span>
            <b>✧</b> Autocuidado no seu ritmo
          </span>
          <span>
            <b>♡</b> Uma rotina com mais carinho
          </span>
          <span>
            <b>♧</b> Frete grátis para clientes VIP
          </span>
        </div>
        <section id="produtos" className="products-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ESCOLHIDOS PARA SUA ROTINA</span>
              <h2>Seu próximo cuidado favorito.</h2>
            </div>
            <span className="collection-label">
              A coleção Lume · 3 essenciais
            </span>
          </div>
          {!panel && error && (
            <div role="alert" className="error">
              {error}{" "}
              <button
                onClick={() => {
                  setError("");
                  loadProducts().catch((e) => setError(e.message));
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}
          {loading ? (
            <p role="status">Preparando seus cuidados…</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <article className="product-card" key={p._id}>
                  <div className={`product-art ${p.kind}`}>
                    <span className="product-tag">
                      {p.stock
                        ? p.kind === "serum"
                          ? "SEU BRILHO DIÁRIO"
                          : "UM ABRAÇO NA PELE"
                        : "EM BREVE DE VOLTA"}
                    </span>
                    <Bottle kind={p.kind} />
                    <span className="volume">{p.volume}</span>
                  </div>
                  <div className="product-meta">
                    <span>{p.category}</span>
                    <span>
                      {p.stock ? `${p.stock} disponíveis` : "Esgotado"}
                    </span>
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-bottom">
                    <strong>{money(p.price)}</strong>
                    <button disabled={!p.stock || busy} onClick={() => add(p)}>
                      {p.stock ? "Adicionar +" : "Indisponível"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section id="clube" className="club">
          <div className="club-symbol">✳</div>
          <div>
            <span className="eyebrow">CLUBE LUME</span>
            <h2>Seu cuidado volta para você.</h2>
            <p>
              {user?.vip
                ? "Você é VIP! Aproveite frete grátis em cada nova compra."
                : `Ao acumular R$ 300 em produtos, você vira VIP e ganha frete grátis nas próximas compras.${user ? ` Faltam ${money(Math.max(0, 30000 - user.spent))} para chegar lá.` : ""}`}
            </p>
          </div>
          <span className="vip-badge">
            LUME
            <br />
            <strong>VIP</strong>
            <br />
            CUIDADO QUE RECOMPENSA
          </span>
        </section>
      </main>
      <footer>
        <a className="logo" href="#">
          lume<span>✳</span>
        </a>
        <p>Beleza em cada pausa.</p>
        <a
          href="http://127.0.0.1:3000/api-docs"
          target="_blank"
          rel="noreferrer"
        >
          Documentação da API
        </a>
        <small>Projeto de portfólio · Compras e produtos demonstrativos</small>
      </footer>
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
        </div>
      )}
      <dialog
        ref={modal}
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else setPanel(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !busy) open(null);
        }}
      >
        <div className="modal-inner">
          <button
            className="close"
            aria-label="Fechar"
            disabled={busy}
            onClick={() => open(null)}
          >
            ×
          </button>
          {(panel === "login" || panel === "register") && (
            <>
              <span className="eyebrow">SEU ESPAÇO LUME</span>
              <h2>
                {panel === "login"
                  ? "Que bom ter você aqui."
                  : "Comece seu ritual."}
              </h2>
              <p>Entre para guardar seus cuidados favoritos na sacola.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = Object.fromEntries(
                    new FormData(e.currentTarget),
                  );
                  action(async () => {
                    const data = await api(`/auth/${panel}`, {
                      method: "POST",
                      body: JSON.stringify(input),
                    });
                    sessionStorage.setItem("lume-token", data.token);
                    setToken(data.token);
                    setUser(data.user);
                    open(null);
                    setToast("Bem-vinda ao seu momento Lume!");
                  });
                }}
              >
                {panel === "register" && (
                  <label>
                    Nome
                    <input
                      name="name"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                    />
                  </label>
                )}
                <label>
                  E-mail
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                  />
                </label>
                <label>
                  Senha
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete={
                      panel === "login" ? "current-password" : "new-password"
                    }
                  />
                </label>
                <small>Mínimo de 8 caracteres.</small>
                <button className="primary" disabled={busy}>
                  {busy
                    ? "Aguarde…"
                    : panel === "login"
                      ? "Entrar"
                      : "Criar minha conta"}
                </button>
              </form>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => open(panel === "login" ? "register" : "login")}
              >
                {panel === "login"
                  ? "Ainda não tenho conta"
                  : "Já tenho uma conta"}
              </button>
            </>
          )}
          {panel === "cart" && (
            <>
              <span className="eyebrow">ESCOLHAS COM CARINHO</span>
              <h2>Sua sacola</h2>
              {cart.items.length ? (
                <>
                  <div className="cart-items">
                    {cart.items.map((i) => (
                      <div className="cart-item" key={i.productId}>
                        <div className={`mini-art ${i.kind}`}>
                          <Bottle kind={i.kind} />
                        </div>
                        <div>
                          <strong>{i.name}</strong>
                          <p>{money(i.price)}</p>
                          <div className="quantity">
                            <button
                              disabled={busy}
                              aria-label={`Diminuir ${i.name}`}
                              onClick={() =>
                                quantity(i.productId, i.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span>{i.quantity}</span>
                            <button
                              disabled={
                                busy ||
                                i.quantity >= i.stock ||
                                i.quantity >= 99
                              }
                              aria-label={`Aumentar ${i.name}`}
                              onClick={() =>
                                quantity(i.productId, i.quantity + 1)
                              }
                            >
                              +
                            </button>
                            <button
                              className="remove"
                              disabled={busy}
                              onClick={() => quantity(i.productId, 0)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totals()}
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() => open("checkout")}
                  >
                    Continuar para finalizar
                  </button>
                  <p className="fine-print">
                    Pague em dinheiro e economize 10% nos produtos.
                  </p>
                </>
              ) : (
                <div className="empty-state">
                  <span>♡</span>
                  <p>Sua sacola está esperando um cuidado especial.</p>
                  <button className="primary" onClick={() => open(null)}>
                    Explorar os produtos
                  </button>
                </div>
              )}
            </>
          )}
          {panel === "checkout" && (
            <>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => open("cart")}
              >
                Voltar à sacola
              </button>
              <h2>Seu cuidado está quase aí.</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const address = Object.fromEntries(
                    new FormData(e.currentTarget),
                  );
                  action(async () => {
                    key.current ||= crypto.randomUUID();
                    const data = await api("/checkout", {
                      method: "POST",
                      headers: { "Idempotency-Key": key.current },
                      body: JSON.stringify({ payment, address }),
                    });
                    setOrder(data.order);
                    setUser(data.user);
                    setCart(empty);
                    key.current = "";
                    open("success");
                    loadProducts().catch(() => {});
                  });
                }}
                onChange={() => {
                  key.current = "";
                }}
              >
                <fieldset disabled={busy}>
                  <legend>Endereço de entrega</legend>
                  <label>
                    Nome de quem recebe
                    <input
                      name="recipient"
                      required
                      minLength={2}
                      maxLength={80}
                      defaultValue={user?.name}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Rua, número e complemento
                    <input
                      name="street"
                      required
                      minLength={3}
                      maxLength={160}
                      autoComplete="street-address"
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Cidade
                      <input
                        name="city"
                        required
                        minLength={2}
                        maxLength={80}
                        autoComplete="address-level2"
                      />
                    </label>
                    <label>
                      UF
                      <input
                        name="state"
                        required
                        pattern="[A-Z]{2}"
                        maxLength={2}
                        placeholder="SP"
                        autoComplete="address-level1"
                        onInput={(e) => {
                          e.currentTarget.value =
                            e.currentTarget.value.toUpperCase();
                        }}
                      />
                    </label>
                    <label>
                      CEP
                      <input
                        name="zip"
                        required
                        pattern="[0-9]{5}-?[0-9]{3}"
                        placeholder="00000-000"
                        autoComplete="postal-code"
                      />
                    </label>
                  </div>
                </fieldset>
                <fieldset disabled={busy}>
                  <legend>Forma de pagamento</legend>
                  <div className="payment-options">
                    <button
                      type="button"
                      className={payment === "card" ? "selected" : ""}
                      aria-pressed={payment === "card"}
                      onClick={() => {
                        setPayment("card");
                        key.current = "";
                      }}
                    >
                      Cartão<span>Pagamento simulado</span>
                    </button>
                    <button
                      type="button"
                      className={payment === "cash" ? "selected" : ""}
                      aria-pressed={payment === "cash"}
                      onClick={() => {
                        setPayment("cash");
                        key.current = "";
                      }}
                    >
                      Dinheiro<span>10% de desconto</span>
                    </button>
                  </div>
                </fieldset>
                {totals()}
                <p className="fine-print">
                  Compra demonstrativa. Nenhuma cobrança ou entrega será
                  realizada.
                </p>
                <button
                  className="primary"
                  disabled={busy || !cart.items.length}
                >
                  {busy ? "Finalizando…" : "Confirmar compra"}
                </button>
              </form>
            </>
          )}
          {panel === "success" && order && (
            <div className="success">
              <span className="success-icon">✓</span>
              <span className="eyebrow">UM MOMENTO SÓ SEU</span>
              <h2>Pedido confirmado!</h2>
              <p>Seu ritual de cuidado ganhou um novo capítulo.</p>
              <div className="order-receipt">
                <span>Pedido #{order._id.slice(-8).toUpperCase()}</span>
                {order.items.map((i) => (
                  <div key={i.productId}>
                    {i.quantity} × {i.name}
                  </div>
                ))}
                <strong>Total: {money(order.total)}</strong>
              </div>
              {user?.vip && (
                <p className="discount">
                  Você é VIP e tem frete grátis nas próximas compras!
                </p>
              )}
              <p className="fine-print">
                Pedido simulado, sem cobrança ou entrega.
              </p>
              <button className="primary" onClick={() => open(null)}>
                Continuar explorando
              </button>
            </div>
          )}
          {panel && error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
