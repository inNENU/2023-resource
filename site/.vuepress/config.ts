import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  title: "in 东师",
  description: "在东师，就用 in 东师",

  lang: "zh-CN",

  head: [
    ["link", { rel: "icon", href: "/logo.svg" }],
    [
      "link",
      {
        rel: "icon",
        href: `/assets/icon/android-chrome-512x512.png`,
        type: "image/png",
        sizes: "192x192",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        href: `/assets/icon/android-chrome-192x192.png`,
        type: "image/png",
        sizes: "192x192",
      },
    ],
    ["meta", { name: "theme-color", content: "#41c98b" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: `/assets/icon/apple-touch-icon.png`,
      },
    ],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black",
      },
    ],
  ],

  theme: hopeTheme({
    favicon: "/favicon.ico",
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
      components: {
        components: ["AudioPlayer", "VideoPlayer"],
      },

      feed: {
        atom: true,
        json: true,
        rss: true,
      },

      mdEnhance: {
        align: true,
        figure: true,
      },

      sitemap: true,
    },
  }),

  plugins: [searchProPlugin({ indexContent: true })],
  shouldPrefetch: () => false,
  shouldPreload: () => false,
});
