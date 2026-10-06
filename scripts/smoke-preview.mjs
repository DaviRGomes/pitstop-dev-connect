import { spawn } from "node:child_process";

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const output = [];
const server = spawn(process.execPath, [".output/server/index.mjs"], {
  env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", (chunk) => output.push(String(chunk)));
server.stderr.on("data", (chunk) => output.push(String(chunk)));

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function request(pathname) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${origin}${pathname}`);
      if (response.ok) return response;
      throw new Error(`${pathname} respondeu HTTP ${response.status}`);
    } catch (error) {
      if (server.exitCode !== null) throw error;
      await delay(250);
    }
  }
  throw new Error(`timeout esperando ${pathname}`);
}

try {
  const paths = ["/", "/en/", "/relatorios/servidores-web", "/en/relatorios/servidores-web"];
  for (const pathname of paths) {
    const response = await request(pathname);
    const body = await response.text();
    if (!body.includes("pitstop")) throw new Error(`${pathname} devolveu HTML inesperado`);
    console.log(`✓ ${pathname} ${response.status}`);
  }
} catch (error) {
  console.error(output.join(""));
  throw error;
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => server.once("exit", resolve)),
      delay(2_000).then(() => server.kill("SIGKILL")),
    ]);
  }
}
