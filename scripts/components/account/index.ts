import { checkKeys } from "@mr-hope/assert-type";

import { type AccountComponentOptions } from "./typings.js";
import { aliasResolve } from "../utils.js";

export const resolveAccount = (
  component: AccountComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (component.logo)
    component.logo = aliasResolve(component.logo, "Image", location);
  if (component.qqcode)
    component.qqcode = aliasResolve(component.qqcode, "Image", location);
  if (component.wxcode)
    component.wxcode = aliasResolve(component.wxcode, "Image", location);

  checkKeys(
    component,
    {
      tag: "string",
      name: "string",
      logo: "string",
      detail: ["string", "undefined"],
      desc: ["string", "undefined"],
      qq: ["number", "undefined"],
      qqid: ["string", "undefined"],
      qqcode: ["string", "undefined"],
      wxid: ["string", "undefined"],
      wxcode: ["string", "undefined"],
      account: ["string", "undefined"],
      location: ["object", "undefined"],
      mail: ["string", "undefined"],
      site: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  // check location
  if (component.location)
    checkKeys(
      component.location,
      { latitude: "number", longitude: "number" },
      `${location}.location`
    );
};

export const getAccountMarkdown = (
  component: AccountComponentOptions
): string => {
  // `$` alias resolve and file check
  if (component.logo) component.logo = aliasResolve(component.logo);
  if (component.qqcode) component.qqcode = aliasResolve(component.qqcode);
  if (component.wxcode) component.wxcode = aliasResolve(component.wxcode);

  const { name, detail, desc, logo, qq, qqcode, wxid, wxcode, site, mail } =
    component;

  return `\
<div class="account">
  <img class="account-background" src="${logo}" alt="${name}" loading="lazy" no-index />
  <div class="account-content">
    <img class="account-logo" src="${logo}" alt="${name}" loading="lazy" no-index />
    <div class="account-name">${name}</div>
${
  detail
    ? `\
    <div class="account-detail">${detail}</div>
`
    : ""
}\
${
  desc
    ? `\
    <div class="account-description">${desc}</div>
`
    : ""
}\
  </div>
  <div class="account-action-list">
${
  qq || qqcode
    ? `\
    <button class="account-action" ${
      qq ? `aria-label="${qq}" data-balloon-pos="up" data-qq="${qq}" ` : ""
    }${qqcode ? `data-qqcode="${qqcode}` : ""}>
      <HopeIcon icon="https://mp.innenu.com/res/icon/qq.svg" no-index />
    </button>
`
    : ""
}\
${
  wxid || wxcode
    ? `\
    <button class="account-action" ${wxid ? `data-wxid="${wxid}" ` : ""}${
        wxcode ? `data-wxcode="${wxcode}" ` : ""
      }>
      <HopeIcon icon="https://mp.innenu.com/res/icon/wechat.svg" no-index />
    </button>
`
    : ""
}\
${
  site
    ? `\
    <a class="account-action" href="${site}" target="_blank">
      <HopeIcon icon="https://mp.innenu.com/res/icon/web.svg" no-index />
    </a>
`
    : ""
}\
${
  mail
    ? `\
    <a class="account-action" href="mailto:${mail}">
      <HopeIcon icon="https://mp.innenu.com/res/icon/mail.svg" no-index />
    </a>
`
    : ""
}\
  </div>
</div>

`;
};
