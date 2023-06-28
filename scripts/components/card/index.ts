import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import { type CardComponentOptions } from "./typings.js";
import { aliasResolve } from "../utils.js";

export const resolveCard = (
  component: CardComponentOptions,
  location = ""
): void => {
  if (component.logo) {
    // check icons
    if (
      !component.logo.match(/^https?:\/\//) &&
      !component.logo.match(/\./) &&
      !existsSync(`./res/icon/${component.logo}.svg`)
    ) {
      console.warn(`Icon ${component.logo} not exist in ${location}`);
    } else component.logo = aliasResolve(component.logo, "Image", location);
  }

  if (component.cover)
    component.cover = aliasResolve(component.cover, "Image", location);

  checkKeys(
    component,
    {
      tag: "string",
      cover: ["string", "undefined"],
      url: ["string", "undefined"],
      title: "string",
      desc: ["string", "undefined"],
      logo: ["string", "undefined"],
      name: ["string", "undefined"],
      options: ["object", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  // check options
  if ("options" in component)
    checkKeys(
      component.options,
      {
        appId: "string",
        envVersion: {
          type: ["string", "undefined"],
          enum: ["develop", "trial", "release", undefined],
        },
        extraData: ["Record<string, any>", "undefined"],
        path: ["string", "undefined"],
        shortLink: ["string", "undefined"],
      },
      `${location}.options`
    );
};

export const getCardMarkdown = (component: CardComponentOptions): string => {
  const logo = component.logo
    ? component.logo.match(/^https?:\/\//)
      ? component.logo
      : aliasResolve(component.logo)
    : null;
  const cover = component.cover ? aliasResolve(component.cover) : null;

  if ("options" in component) return "";

  const { name, desc, title, url } = component;

  if (url.startsWith("info?"))
    return `\
<MDLink class="innenu-card">
${
  cover
    ? `
  <img class="innenu-card-cover" src="${cover}" alt="${title}" no-view />
`
    : ""
}
  <div class="innenu-card-detail">
    <div class="innenu-card-info">
${
  logo
    ? `
      <img class="innenu-card-logo" src="${logo}" alt="${title}" no-view />
`
    : ""
}
      <div class="innenu-card-name">${name}</div>
    </div>
    <div class="innenu-card-title">${title}</div>
    <div class="innenu-card-desc">${desc}</div>
  </div>
</MDLink>
`;

  return "";
};
