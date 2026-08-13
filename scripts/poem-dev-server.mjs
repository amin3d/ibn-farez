/**
 * سرور سبک فقط برای dev — ذخیرهٔ مستقیم در poems.json
 * با `next dev` از طریق instrumentation.ts خودکار اجرا می‌شود.
 */
import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POEMS_PATH = path.join(__dirname, "../public/data/poems.json");
export const POEM_DEV_SERVER_PORT = 3847;

/** @type {import("http").Server | null} */
let server = null;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function isPoem(value) {
  if (!value || typeof value !== "object") return false;
  const p = value;
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.alias === "string" &&
    typeof p.poet === "string" &&
    Array.isArray(p.verses)
  );
}

function createHandler() {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url ?? "";
    const match = url.match(/^\/api\/dev\/poems\/([^/?]+)$/);

    if (req.method !== "PUT" || !match) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    const id = decodeURIComponent(match[1]);

    try {
      const raw = await readBody(req);
      const updated = JSON.parse(raw);

      if (!isPoem(updated) || updated.id !== id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "دادهٔ شعر نامعتبر" }));
        return;
      }

      const poemsRaw = await fs.readFile(POEMS_PATH, "utf-8");
      const poems = JSON.parse(poemsRaw);
      const index = poems.findIndex((p) => p.id === id);

      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "شعر یافت نشد" }));
        return;
      }

      poems[index] = updated;
      await fs.writeFile(
        POEMS_PATH,
        JSON.stringify(poems, null, 2) + "\n",
        "utf-8"
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, poem: updated }));
    } catch (err) {
      console.error("Poem save error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "خطا در ذخیرهٔ فایل" }));
    }
  };
}

export function startPoemDevServer() {
  if (server) return server;

  server = http.createServer(createHandler());

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(
        `[poem-dev-server] پورت ${POEM_DEV_SERVER_PORT} اشغال است — فرض می‌کنیم سرور از قبل در حال اجراست`
      );
      return;
    }
    console.error("[poem-dev-server] خطا:", err);
  });

  server.listen(POEM_DEV_SERVER_PORT, () => {
    console.log(
      `[poem-dev-server] listening on http://127.0.0.1:${POEM_DEV_SERVER_PORT}`
    );
  });

  return server;
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  startPoemDevServer();
}
