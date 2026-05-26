import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    sourcemapIgnoreList: false,
    proxy: {
      "/api": {
        target: "http://localhost:5142",
        changeOrigin: true,
        secure: false,
        }
      }
    }
});
