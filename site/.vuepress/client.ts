import { defineClientConfig } from "@vuepress/client";
import { VPLink } from "vuepress-shared/client";
import { setupAccount } from "./composables/index.js";

export default defineClientConfig({
  setup() {
    setupAccount();
  },
});
