import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let secret = process.env.JWT_SECRET || randomBytes(48).toString("hex");
const db = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: "wiredTiger" },
});
await mongoose.connect(db.getUri());
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    spent: { type: Number, default: 0 },
    cart: [{ productId: String, quantity: Number }],
  }),
);
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    price: Number,
    stock: Number,
    kind: String,
    volume: String,
  }),
);
const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    userId: String,
    key: String,
    payment: String,
    address: Object,
    items: [Object],
    subtotal: Number,
    discount: Number,
    shipping: Number,
    total: Number,
    createdAt: Date,
  }),
);
Order.schema.index({ userId: 1, key: 1 }, { unique: true });
await Promise.all([User.init(), Order.init()]);
await Product.insertMany([
  {
    name: "Sérum Ilumina",
    category: "ROSTO",
    description:
      "Um toque de luminosidade para o seu ritual diário. Textura leve e acabamento suave.",
    price: 8990,
    stock: 20,
    kind: "serum",
    volume: "30 ml",
  },
  {
    name: "Hidratante Abraço",
    category: "CORPO",
    description:
      "Cuidado que envolve. Uma textura cremosa para transformar a rotina em uma pausa só sua.",
    price: 5990,
    stock: 15,
    kind: "cream",
    volume: "200 ml",
  },
  {
    name: "Protetor Solar Aurora",
    category: "ROSTO",
    description:
      "O último passo do seu ritual da manhã. Toque seco e textura confortável.",
    price: 7990,
    stock: 0,
    kind: "sun",
    volume: "50 ml · FPS 50",
  },
]);
const password = await bcrypt.hash("Lume@123", 12);
await User.insertMany([
  { name: "Ana Silva", email: "ana@lume.com", password, spent: 0 },
  { name: "Bia Santos", email: "bia@lume.com", password, spent: 25000 },
  { name: "Clara Lima", email: "clara@lume.com", password, spent: 35000 },
]);
const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "16kb" }));
const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  spent: u.spent,
  vip: u.spent >= 30000,
});
const authResult = (u) => ({
  user: publicUser(u),
  token: jwt.sign({}, secret, { subject: u.id, expiresIn: "2h" }),
});
const fail = (status, message) => Object.assign(new Error(message), { status });
const auth = async (req, res, next) => {
  try {
    const payload = jwt.verify(
      (req.headers.authorization || "").replace(/^Bearer /, ""),
      secret,
    );
    req.user = await User.findById(payload.sub);
    if (!req.user) throw Error();
    next();
  } catch {
    next(fail(401, "Sua sessão expirou. Entre novamente."));
  }
};
const credentials = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: { message: "Muitas tentativas. Tente novamente em 15 minutos." },
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.post("/api/auth/register", authLimiter, async (req, res) => {
  const input = credentials
    .extend({ name: z.string().trim().min(2).max(80) })
    .parse(req.body);
  const u = await User.create({
    ...input,
    password: await bcrypt.hash(input.password, 12),
  });
  res.status(201).json(authResult(u));
});
app.post("/api/auth/login", authLimiter, async (req, res) => {
  const input = credentials.parse(req.body);
  const u = await User.findOne({ email: input.email });
  if (!u || !(await bcrypt.compare(input.password, u.password)))
    throw fail(401, "E-mail ou senha incorretos.");
  res.json(authResult(u));
});
app.get("/api/me", auth, (req, res) => res.json(publicUser(req.user)));
app.get("/api/products", async (req, res) =>
  res.json(await Product.find().lean()),
);
async function summary(user, payment = "card", session = null) {
  const products = await Product.find({
    _id: { $in: user.cart.map((i) => i.productId) },
  }).session(session);
  const items = user.cart.map((item) => {
    const p = products.find((p) => p.id === item.productId);
    if (!p) throw fail(409, "Produto indisponível.");
    return {
      productId: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      kind: p.kind,
      quantity: item.quantity,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = payment === "cash" ? Math.round(subtotal * 0.1) : 0;
  const shipping = !items.length || user.spent >= 30000 ? 0 : 2000;
  return {
    items,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}
app.get("/api/cart", auth, async (req, res) => {
  const payment = z
    .enum(["cash", "card"])
    .default("card")
    .parse(req.query.payment);
  res.json(await summary(req.user, payment));
});
const itemInput = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  quantity: z.number().int().min(1).max(99),
});
app.put("/api/cart/items", auth, async (req, res) => {
  const input = itemInput.parse(req.body);
  await mongoose.connection.transaction(async (session) => {
    const u = await User.findById(req.user.id).session(session);
    const p = await Product.findById(input.productId).session(session);
    if (!p || p.stock < input.quantity)
      throw fail(409, "Estoque insuficiente para esta quantidade.");
    const item = u.cart.find((i) => i.productId === input.productId);
    if (item) item.quantity = input.quantity;
    else u.cart.push(input);
    await u.save({ session });
  });
  res.json(await summary(await User.findById(req.user.id)));
});
app.delete("/api/cart/items/:id", auth, async (req, res) => {
  const u = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { cart: { productId: req.params.id } } },
    { new: true },
  );
  res.json(await summary(u));
});
const checkout = z.object({
  payment: z.enum(["cash", "card"]),
  address: z.object({
    recipient: z.string().trim().min(2).max(80),
    street: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(80),
    state: z.string().regex(/^[A-Z]{2}$/),
    zip: z.string().regex(/^\d{5}-?\d{3}$/),
  }),
});
app.post("/api/checkout", auth, async (req, res) => {
  const input = checkout.parse(req.body);
  const key = z.string().uuid().parse(req.headers["idempotency-key"]);
  let result;
  await mongoose.connection.transaction(async (session) => {
    const existing = await Order.findOne({ userId: req.user.id, key }).session(
      session,
    );
    if (existing) {
      result = existing;
      return;
    }
    const u = await User.findById(req.user.id).session(session);
    if (!u.cart.length) throw fail(400, "Seu carrinho está vazio.");
    const totals = await summary(u, input.payment, session);
    for (const item of totals.items) {
      const updated = await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session },
      );
      if (!updated.modifiedCount)
        throw fail(
          409,
          `Estoque insuficiente: ${item.name}. Atualize seu carrinho.`,
        );
    }
    [result] = await Order.create(
      [{ userId: u.id, key, ...input, ...totals, createdAt: new Date() }],
      { session },
    );
    u.spent += totals.subtotal - totals.discount;
    u.cart = [];
    await u.save({ session });
  });
  res
    .status(201)
    .json({
      order: result,
      user: publicUser(await User.findById(req.user.id)),
    });
});
app.get("/api/openapi.yaml", (req, res) =>
  res.type("application/yaml").sendFile(path.join(root, "openapi.yaml")),
);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    YAML.parse(readFileSync(path.join(root, "openapi.yaml"), "utf8")),
  ),
);
app.use("/api", (req, res) =>
  res.status(404).json({ message: "Endpoint não encontrado." }),
);
app.use(express.static(path.join(root, "dist")));
app.get("/", (req, res) => res.sendFile(path.join(root, "dist/index.html")));
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError)
    return res
      .status(400)
      .json({
        message: "Confira os campos informados.",
        details: err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
  if (err.code === 11000)
    return res
      .status(409)
      .json({
        message:
          "Registro já existente. Verifique o e-mail ou atualize o pedido.",
      });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res
    .status(status)
    .json({
      message:
        status === 500
          ? "Não foi possível concluir. Tente novamente."
          : err.message,
    });
});
const server = app.listen(process.env.PORT || 3000, "127.0.0.1", () =>
  console.log(
    "Lume: http://127.0.0.1:3000 | Swagger: http://127.0.0.1:3000/api-docs",
  ),
);
async function stop() {
  server.close();
  await mongoose.disconnect();
  await db.stop();
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

// Somente processos de teste criados com fork recebem o canal IPC.
if (process.env.NODE_ENV === "test" && process.send) {
  const { installTestControl } = await import("./test-control.js");
  await installTestControl({ User, Product, Order, authLimiter,
    rotateSecret: () => { secret = randomBytes(48).toString("hex"); },
    expiredToken: (id) => jwt.sign({}, secret, { subject: id, expiresIn: -1 }),
  });
}
