import { checkKeys } from "@mr-hope/assert-type";

import { LocationComponentOptions } from "./typings.js";

export const resolveLocation = (
  component: LocationComponentOptions,
  location = ""
): void => {
  checkKeys(
    component,
    {
      tag: "string",
      title: "string",
      points: "object[]",
      navigate: ["boolean", "undefined"],
    },
    location
  );

  component.points.forEach((item) => {
    checkKeys(item, {
      latitude: "number",
      longitude: "number",
      name: ["string", "undefined"],
      detail: ["string", "undefined"],
      path: ["string", "undefined"],
    });
  });
};

export const getLocationMarkdown = (
  component: LocationComponentOptions
): string => {
  const { title, points = [] } = component;

  return `\
${
  title
    ? `\
#### ${title}

`
    : ""
}\
<iframe class="location-iframe" src="https://apis.map.qq.com/tools/poimarker?type=0&marker=${points
    // maximum 4 points
    .slice(0, 4)
    .map(
      ({ latitude, longitude, name = "", detail = "" }) =>
        `coord:${latitude},${longitude};title:${name};addr:${detail}`
    )
    .join(
      "|"
    )}&key=YNUBZ-AN3HF-P62JK-J2GND-XQTQQ-TTBOB&referer=in东师" frameborder="0" width="100%" height="320px" />

`;
};
