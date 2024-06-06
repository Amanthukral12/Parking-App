import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  registerType: "autoUpdate",
  manifest: {
    name: "Park Saver",
    short_name: "Park Saver",
    description: "A Parking Saver App",
    theme_color: "#000",
    background_color: "#000",
    display: "standalone",
    scope: "/",
    start_url: ".",
    orientation: "portrait",
    icons: [
      {
        src: "./assets/Front-car-pana.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "./assets/Front-car-pana.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        secure: false,
      },
    },
  },
  base: "./",
  plugins: [react(), VitePWA(manifestForPlugin)],
});
