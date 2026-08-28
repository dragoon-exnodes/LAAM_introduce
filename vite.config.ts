import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The 3D runtime stays out of the initial payload via the dynamic import in
// SplineStage, so no manual chunking is needed here.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
