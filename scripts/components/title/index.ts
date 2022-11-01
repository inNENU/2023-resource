import { checkKeys } from "@mr-hope/assert-type";
import { resolveStyle } from "../utils.js";
import { TitleComponentOptions } from "./typings.js";

export const resolveTitle = (
  element: TitleComponentOptions,
  location = ""
): void => {
  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  checkKeys(
    element,
    {
      tag: "string",
      text: "string",
      style: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
