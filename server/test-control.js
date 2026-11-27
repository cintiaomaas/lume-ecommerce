// Não há rota HTTP de manutenção. Este módulo só é carregado em NODE_ENV=test + IPC.
export async function installTestControl({ User, Product, Order, authLimiter, rotateSecret, expiredToken }) {
  const users = await User.find().lean();
  const products = await Product.find().lean();
  process.on("message", async ({ id, action, data = {} }) => {
    try {
      let result = null;
      if (action === "reset") {
        await Order.deleteMany({});
        await User.deleteMany({});
        await Product.deleteMany({});
        await User.insertMany(users);
        await Product.insertMany(products);
        await authLimiter.resetKey("127.0.0.1");
        rotateSecret();
      } else if (action === "prepare") {
        if (data.spent !== undefined) {
          if (!Number.isSafeInteger(data.spent) || data.spent < 0) throw Error("Saldo inválido");
          await User.updateOne({ email: "ana@lume.com" }, { spent: data.spent });
        }
        if (data.stock === 99) await Product.updateOne({ kind: "serum" }, { stock: 99 });
        if (data.rounding) await Product.create({ name: "Produto exclusivo QA", kind: "qa", price: 10005, stock: 2 });
      } else if (action === "expiredToken") {
        result = expiredToken(String(users[0]._id));
      } else throw Error("Comando desconhecido");
      process.send({ id, result });
    } catch (error) { process.send({ id, error: error.message }); }
  });
  process.send({ ready: true });
}
