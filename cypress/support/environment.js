import { fork } from "node:child_process";
import { createServer } from "vite";
import { createServer as tcpServer } from "node:net";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { beforeRunHook, afterRunHook } from "cypress-mochawesome-reporter/lib/index.js";

export async function startEnvironment(on, config) {
  const api = new URL(config.env.apiUrl);
  const ui = new URL(config.baseUrl);
  for (const url of [api, ui]) {
    if (url.hostname !== "127.0.0.1" || url.protocol !== "http:") {
      throw Error("A suíte destrutiva aceita apenas http://127.0.0.1 em ambiente descartável.");
    }
    await new Promise((resolve, reject) => {
      const probe = tcpServer();
      probe.once("error", () => reject(Error(`Porta ${url.port} ocupada. Encerre a aplicação antes dos testes.`)));
      probe.listen(Number(url.port), "127.0.0.1", () => probe.close(resolve));
    });
  }
  mkdirSync("cypress/results", { recursive: true });
  writeFileSync("cypress/results/timings.jsonl", "");
  const backend = fork("server/index.js", [], {
    env: { ...process.env, NODE_ENV: "test", PORT: api.port },
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  });
  let vite;
  const stop = async () => { if (backend.connected) backend.kill("SIGTERM"); await vite?.close(); };
  process.once("exit", () => backend.kill("SIGTERM"));
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error("API não iniciou em 120s; verifique o download do MongoDB.")), 120000);
      backend.on("message", (message) => { if (message.ready) { clearTimeout(timer); resolve(); } });
      backend.once("exit", (code) => { clearTimeout(timer); reject(Error(`API encerrou: ${code}`)); });
    });
    const health = await fetch(`${api.origin}/api/health`);
    if (!health.ok) throw Error("API indisponível");
    vite = await createServer({ server: { host: "127.0.0.1", port: Number(ui.port), strictPort: true,
      proxy: { "/api": api.origin } } });
    await vite.listen();
  } catch (error) { await stop(); throw error; }
  function control(action, data) {
    return new Promise((resolve, reject) => {
      const id = randomUUID();
      const timer = setTimeout(() => { backend.off("message", receive); reject(Error(`IPC: ${action} excedeu 10s`)); }, 10000);
      function receive(message) {
        if (message.id !== id) return;
        clearTimeout(timer); backend.off("message", receive);
        if (message.error) reject(Error(message.error)); else resolve(message.result);
      }
      backend.on("message", receive);
      backend.send({ id, action, data });
    });
  }
  on("task", {
    reset: () => control("reset"),
    prepare: (data) => control("prepare", data),
    expiredToken: () => control("expiredToken"),
    timing(data) { appendFileSync("cypress/results/timings.jsonl", JSON.stringify(data) + "\n"); return null; },
    async concurrentCheckout(requests) {
      return Promise.all(requests.map(async ({ token, body, key }) => {
        const response = await fetch(`${api.origin}/api/checkout`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Idempotency-Key": key },
          body: JSON.stringify(body),
        });
        return { status: response.status, body: await response.json() };
      }));
    },
  });
  on("before:run", async (details) => {
    await beforeRunHook(details);
  });
  on("after:run", async (results) => {
    try {
      writeFileSync("cypress/results/latest.json", JSON.stringify(results, null, 2));
      await afterRunHook();
    } finally {
      await stop();
    }
  });
}
