import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function apiDevPlugin(mode: string): Plugin {
  return {
    name: "api-dev",
    configureServer(server: ViteDevServer) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        try {
          const urlPath = req.url.split("?")[0];
          const apiName = urlPath.slice("/api/".length);
          if (!/^[a-zA-Z0-9_-]+$/.test(apiName)) {
            res.statusCode = 404;
            res.end();
            return;
          }
          const modulePath = path.resolve(process.cwd(), "api", `${apiName}.ts`);

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const rawBody = Buffer.concat(chunks).toString();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const vreq = req as any;
          try {
            vreq.body = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            vreq.body = rawBody;
          }
          vreq.query = Object.fromEntries(
            new URL(req.url, "http://localhost").searchParams
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const vres = res as any;
          vres.status = (code: number) => {
            res.statusCode = code;
            return vres;
          };
          vres.json = (data: unknown) => {
            if (!res.getHeader("Content-Type")) {
              res.setHeader("Content-Type", "application/json");
            }
            res.end(JSON.stringify(data));
            return vres;
          };
          vres.send = (data: unknown) => {
            if (typeof data === "string") {
              res.end(data);
            } else {
              if (!res.getHeader("Content-Type")) {
                res.setHeader("Content-Type", "application/json");
              }
              res.end(JSON.stringify(data));
            }
            return vres;
          };

          const mod = await server.ssrLoadModule(modulePath);
          const handler = mod.default;
          if (typeof handler !== "function") {
            res.statusCode = 500;
            res.end("Handler not found");
            return;
          }

          await handler(vreq, vres);
        } catch (err) {
          console.error("[api-dev] error:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Dev API error" }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && apiDevPlugin(mode),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
