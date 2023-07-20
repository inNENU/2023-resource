import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { type SearchInfo } from "./typings.js";
import { type PageOptions } from "../components/typings.js";
import { getFileList } from "../utils/index.js";

const TITLE = 1;
const HEADING = 2;
const TEXT = 3;
const IMAGE = 4;
const CARD = 5;
const DOC = 6;

// 创建搜索字典
const createSearchMap = (folder: string): SearchInfo => {
  const fileList = getFileList(folder, "json");

  const searchMap: SearchInfo = {};

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(folder, filePath), {
      encoding: "utf-8",
    });
    const pageConfig = <PageOptions>JSON.parse(content);
    const pathName = `${folder}/${filePath}`.replace(
      /\.\/r\/(.*)\.json/u,
      "$1",
    );

    // 生成对应页面的索引对象
    searchMap[pathName] = [pageConfig.title, []];

    // 将页面的标题写入搜索详情中
    pageConfig.content.forEach((element) => {
      /** 写入段落大标题 */
      if (element.tag === "title")
        searchMap[pathName][1].push([TITLE, element.text]);
      else if (
        element.tag === "text" ||
        element.tag === "ul" ||
        element.tag === "ol" ||
        element.tag === "p"
      ) {
        /** 写入段落标题 */
        if (element.heading && element.heading !== true)
          searchMap[pathName][1].push([HEADING, element.heading]);

        /** 写入段落文字 */
        if (element.text)
          element.text.forEach((item) => {
            searchMap[pathName][1].push([TEXT, item]);
          });
      } else if (element.tag === "img" && element.desc)
        searchMap[pathName][1].push([
          IMAGE,
          {
            desc: element.desc,
            icon: element.src.match(/\.jpe?g$/i)
              ? "jpg"
              : element.src.match(/\.png$/i)
              ? "png"
              : "document",
          },
        ]);
      else if (element.tag === "list") {
        /** 写入段落标题 */
        if (element.header)
          searchMap[pathName][1].push([HEADING, element.header]);

        /** 写入段落文字  */
        element.items?.forEach((config) => {
          if (config.text && !config.path && !config.url)
            searchMap[pathName][1].push([TEXT, config.text]);
        });
      } else if (element.tag === "card")
        searchMap[pathName][1].push([
          CARD,
          {
            title: element.title,
            desc: element.desc || "",
          },
        ]);
      else if (element.tag === "doc")
        searchMap[pathName][1].push([
          DOC,
          {
            name: element.name,
            icon: element.icon,
          },
        ]);
      else if (element.tag === "account") {
        searchMap[pathName][1].push([HEADING, element.name]);
        if (element.detail) searchMap[pathName][1].push([TEXT, element.detail]);
        if (element.desc) searchMap[pathName][1].push([TEXT, element.desc]);
      } else if (element.tag === "phone")
        searchMap[pathName][1].push([
          TEXT,
          `${element.lName || ""}${element.fName}: ${element.num}`,
        ]);
    });
  });

  return searchMap;
};

/** 生成关键词 */
export const genSearchMap = (): void => {
  console.log("Generating search index...");

  const guideSearchMap = {
    ...createSearchMap("./d/guide"),
    ...createSearchMap("./d/newcomer"),
  };
  const introSearchMap = {
    ...createSearchMap("./d/apartment"),
    ...createSearchMap("./d/intro"),
    ...createSearchMap("./d/school"),
  };

  // 写入关键词列表
  writeFileSync("./d/guide-search.json", JSON.stringify(guideSearchMap));
  writeFileSync("./d/intro-search.json", JSON.stringify(introSearchMap));
  writeFileSync(
    "./d/all-search.json",
    JSON.stringify({ ...guideSearchMap, ...introSearchMap }),
  );

  console.log("Search index generated");
};
