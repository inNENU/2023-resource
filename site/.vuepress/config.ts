import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  title: "in 东师",
  description: "在东师，就用 in 东师",

  lang: "zh-CN",

  theme: hopeTheme({
    logo: "/logo.svg",
    hostname: "https://docs.innenu.com",
    repo: "Hope-Studio/innenu-res",

    copyright: `使用 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> 协议`,

    navbar: ["/", "/guide/", "/intro/"],

    sidebar: {
      "/": false,
      "/guide/": "structure",
      "/intro/": "structure",
      "/other/": "structure",
    },

    plugins: {
      mdEnhance: {
        align: true,
      },
    },
  }),

  plugins: [searchProPlugin({ indexContent: true })],
});
