import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    host: "0.0.0.0",
    port: 4600,
    open: true,
    proxy: {
      "/api/v1": {
        target: "https://agrokeep-backend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
