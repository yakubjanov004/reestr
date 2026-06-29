import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ["datan.uz", "www.datan.uz"],
    proxy: {
      "/api": "http://127.0.0.1:8002"
    },
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        process.cwd(),
        process.cwd().replace(/^[a-zA-Z]/, (match) => match.toUpperCase()),
        process.cwd().replace(/^[a-zA-Z]/, (match) => match.toLowerCase())
      ]
    }
  }
});
