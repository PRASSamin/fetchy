import { defineConfig } from "@redenv/core";
import { studioPlugin } from "@redenv/studio";

export default defineConfig({
  environment: "development",
  name: "fetchy",
  plugins: [studioPlugin],
});
