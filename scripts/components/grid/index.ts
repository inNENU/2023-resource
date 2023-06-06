import { existsSync } from "node:fs";

import { checkKeys } from "@mr-hope/assert-type";

import { type GridComponentOptions } from "./typings.js";
import { getPath, indent, resolvePath } from "../utils.js";

export const resolveGrid = (
  element: GridComponentOptions,
  pageId: string,
  location = ""
): void => {
  element.items?.forEach((gridItem) => {
    // 处理路径
    if (gridItem.path)
      if (gridItem.path.startsWith("/")) {
        const path = resolvePath(gridItem.path);

        if (!existsSync(`./res/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        gridItem.path = path;
      } else {
        const paths = pageId.split("/");

        paths.pop();

        const path = resolvePath(`${paths.join("/")}/${gridItem.path}`);

        if (!existsSync(`./res/${path}.yml`))
          console.error(`Path ${path} not exists in ${location}`);

        gridItem.path = path;
      }

    if (
      gridItem.icon &&
      !gridItem.icon.match(/^https?:\/\//) &&
      !gridItem.icon.match(/\./) &&
      !existsSync(`./res/icon/${gridItem.icon}.svg`)
    ) {
      console.warn(`Icon ${gridItem.icon} not exist in ${location}`);
    }

    checkKeys(
      gridItem,
      {
        text: "string",
        icon: "string",
        base64Icon: ["string", "undefined"],
        color: "string",
        name: "string",
        path: ["string", "undefined"],
        url: ["string", "undefined"],
        env: ["string[]", "undefined"],
      },
      `${location}.content`
    );
  });

  checkKeys(
    element,
    {
      tag: "string",
      header: { type: ["string", "undefined"], additional: [false] },
      items: "array",
      footer: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};

export const getGridMarkdown = (component: GridComponentOptions): string => {
  const { header, footer, items = [] } = component;

  return `\
${
  header
    ? `\
#### ${header}

`
    : ""
}\
<div class="list">

${items
  .map((item) => {
    if ("type" in item || "url" in item) return null;

    const { text, path } = item;

    return `- ${path ? `[${text}](${getPath(path)})` : indent(text, 3)}`;
  })
  .filter((item): item is string => item !== null)
  .join("\n")}

</div>

${footer ? `> ${footer}\n\n` : ""}\
`;
};
