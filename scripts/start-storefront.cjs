const net = require("net");
const { spawn } = require("child_process");

const PROXY_PORT = Number(process.env.PROXY_PORT || 8081);
const TARGET_PORT = Number(process.env.TARGET_PORT || process.env.PORT || 5000);
const TARGET_HOST = process.env.TARGET_HOST || "127.0.0.1";

let child = null;
let shuttingDown = false;

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (child && !child.killed) {
    child.kill("SIGTERM");
  }
  process.exit(code);
}

const proxy = net.createServer((client) => {
  const upstream = net.connect(TARGET_PORT, TARGET_HOST);
  client.pipe(upstream);
  upstream.pipe(client);
  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
});

proxy.on("error", (err) => {
  console.error(`[start-storefront] proxy failed on ${PROXY_PORT}: ${err.message}`);
  shutdown(1);
});

proxy.listen(PROXY_PORT, "0.0.0.0", () => {
  console.log(
    `[start-storefront] proxy forwarding 0.0.0.0:${PROXY_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`,
  );

  child = spawn(
    "pnpm",
    ["--filter", "@workspace/peptide-sciences", "run", "dev"],
    { stdio: "inherit", env: process.env },
  );

  child.on("exit", (code, signal) => {
    console.error(
      `[start-storefront] vite exited (code=${code}, signal=${signal}); shutting down`,
    );
    proxy.close();
    shutdown(code == null ? 1 : code);
  });

  child.on("error", (err) => {
    console.error(`[start-storefront] failed to launch vite: ${err.message}`);
    shutdown(1);
  });
});

["SIGTERM", "SIGINT"].forEach((sig) => {
  process.on(sig, () => {
    console.error(`[start-storefront] received ${sig}; shutting down`);
    proxy.close();
    shutdown(0);
  });
});
