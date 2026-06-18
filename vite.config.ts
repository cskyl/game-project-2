import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base ("./") makes the built site work whether it is served from the
// domain root or from a GitHub Pages project subpath (e.g. /game-project-2/).
// No need to hardcode the repo name.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
