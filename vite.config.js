import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          swiper: ["swiper"],
          motion: ["framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
