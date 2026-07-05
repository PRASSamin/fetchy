import { defineConfig } from "@redenv/core";
import { studioPlugin } from "@redenv/studio";

export default defineConfig({
  environment: "production",
  name: "fetchy",
  plugins: [studioPlugin],
});
