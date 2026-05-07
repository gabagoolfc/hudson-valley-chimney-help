import { defineConfig } from "vite";
import path from "path";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  base: "/",
  root: path.resolve(import.meta.dirname),
  publicDir: path.resolve(import.meta.dirname, "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        "chimney-sweep": path.resolve(import.meta.dirname, "chimney-sweep/index.html"),
        "chimney-cleaning": path.resolve(import.meta.dirname, "chimney-cleaning/index.html"),
        "chimney-repair": path.resolve(import.meta.dirname, "chimney-repair/index.html"),
        "chimney-inspection": path.resolve(import.meta.dirname, "chimney-inspection/index.html"),
        "chimney-liner-repair": path.resolve(import.meta.dirname, "chimney-liner-repair/index.html"),
        "orange-county": path.resolve(import.meta.dirname, "orange-county/index.html"),
        "dutchess-county": path.resolve(import.meta.dirname, "dutchess-county/index.html"),
        "ulster-county": path.resolve(import.meta.dirname, "ulster-county/index.html"),
        "sullivan-county": path.resolve(import.meta.dirname, "sullivan-county/index.html"),
        "putnam-county": path.resolve(import.meta.dirname, "putnam-county/index.html"),
        "rockland-county": path.resolve(import.meta.dirname, "rockland-county/index.html"),
        "westchester-county": path.resolve(import.meta.dirname, "westchester-county/index.html"),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
