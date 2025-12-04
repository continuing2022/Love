import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // simple dev-only API for reading/writing messages JSON
    {
      name: "vite-plugin-messages-api",
      configureServer(server) {
        const dataFile = path.resolve(
          __dirname,
          "src",
          "data",
          "messages.json"
        );

        async function readData() {
          try {
            const txt = await fs.promises.readFile(dataFile, "utf-8");
            return JSON.parse(txt || "[]");
          } catch (e) {
            if (e.code === "ENOENT") return [];
            server.config.logger.error(e);
            return [];
          }
        }

        async function writeData(data) {
          try {
            const tmp = dataFile + ".tmp";
            await fs.promises.writeFile(
              tmp,
              JSON.stringify(data, null, 2),
              "utf-8"
            );
            await fs.promises.rename(tmp, dataFile);
          } catch (e) {
            server.config.logger.error(e);
            throw e;
          }
        }

        server.middlewares.use(async (req, res, next) => {
          if (!req.url || !req.url.startsWith("/api/messages")) return next();

          try {
            if (req.method === "GET" && req.url === "/api/messages") {
              const data = await readData();
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return;
            }

            if (req.method === "POST" && req.url === "/api/messages") {
              let body = "";
              for await (const chunk of req) body += chunk;
              const payload = body ? JSON.parse(body) : {};
              const text = payload && payload.text ? String(payload.text) : "";
              if (!text.trim()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "text required" }));
                return;
              }
              const data = await readData();
              const msg = {
                id: Date.now(),
                text: text.trim(),
                timestamp: Date.now(),
              };
              data.push(msg);
              await writeData(data);
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(msg));
              return;
            }

            // DELETE /api/messages/:id
            if (
              req.method === "DELETE" &&
              req.url.startsWith("/api/messages/")
            ) {
              const parts = req.url.split("/");
              const id = Number(parts[parts.length - 1]);
              if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "invalid id" }));
                return;
              }
              let data = await readData();
              const beforeLen = data.length;
              data = data.filter((m) => m.id !== id);
              if (data.length === beforeLen) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "not found" }));
                return;
              }
              await writeData(data);
              res.statusCode = 204;
              res.end();
              return;
            }

            // not handled
            next();
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      },
    },
  ],
});
