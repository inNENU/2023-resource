import { defineClientConfig } from "@vuepress/client";
// import { defineSearchConfig } from "vuepress-plugin-search-pro/client";
import { setupAccount } from "./composables/index.js";

// defineSearchConfig({
//   bm25: {
//     b: 0.75,
//     d: 0.3,
//     k: 0.5,
//   },
// });

export default defineClientConfig({
  setup() {
    setupAccount();
  },
});
