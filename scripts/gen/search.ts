import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { load } from "js-yaml";

import { type PageOptions } from "../components/typings.js";
import { getFileList } from "../utils/index.js";

const enum SearchItemType {
  Page = 0,
  ID = 1,
}

const enum SearchIndexType {
  TITLE = 1,
  HEADING = 2,
  TEXT = 3,
  IMAGE = 4,
  CARD = 5,
  DOC = 6,
}

export type TitleSearchIndex = [SearchIndexType.TITLE, string];
export type HeadingSearchIndex = [SearchIndexType.HEADING, string];
export type TextSearchIndex = [SearchIndexType.TEXT, string];
export type ImageSearchIndex = [
  SearchIndexType.IMAGE,
  { desc: string; icon: string },
];
export type CardSearchIndex = [
  SearchIndexType.CARD,
  { title: string; desc: string },
];
export type DocSearchIndex = [
  SearchIndexType.DOC,
  { name: string; icon: string },
];
export type SearchIndex =
  | TitleSearchIndex
  | HeadingSearchIndex
  | TextSearchIndex
  | ImageSearchIndex
  | DocSearchIndex
  | CardSearchIndex;

export type IDContentIndex = [
  SearchItemType.ID,
  /** 页面名称 */
  string,
  /** 搜索索引 */
  SearchIndex[],
];

export type PageIndex = [
  SearchItemType.Page,
  /** 页面名称 */
  string,
  /** 页面图标 */
  string,
  /** 页面标签 */
  string[]?,
];

export type SearchMap = Record<
  // 页面 ID 或 路径
  string,
  // 页面内容
  IDContentIndex | PageIndex
>;

// 创建搜索字典
const createSearchMap = (folder: string): SearchMap => {
  const fileList = getFileList(folder, "json");

  const searchMap: SearchMap = {};

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(folder, filePath), {
      encoding: "utf-8",
    });
    const page = <PageOptions>JSON.parse(content);
    const id = `${folder}/${filePath}`.replace(/\.\/d\/(.*)\.json/u, "$1");

    // 生成对应页面的索引对象
    const pageIndex: IDContentIndex = [SearchItemType.ID, page.title, []];

    searchMap[id] = pageIndex;

    // 将页面的标题写入搜索详情中
    page.content.forEach((element) => {
      /** 写入段落大标题 */
      if (element.tag === "title")
        pageIndex[2].push([SearchIndexType.TITLE, element.text]);
      else if (
        element.tag === "text" ||
        element.tag === "ul" ||
        element.tag === "ol" ||
        element.tag === "p"
      ) {
        /** 写入段落标题 */
        if (element.heading && element.heading !== true)
          pageIndex[2].push([SearchIndexType.HEADING, element.heading]);

        /** 写入段落文字 */
        element.text?.forEach((item) => {
          pageIndex[2].push([SearchIndexType.TEXT, item]);
        });
      } else if (element.tag === "img" && element.desc)
        pageIndex[2].push([
          SearchIndexType.IMAGE,
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
          pageIndex[2].push([SearchIndexType.HEADING, element.header]);

        /** 写入段落文字  */
        element.items?.forEach((config) => {
          if (config.text && !config.path && !config.url)
            pageIndex[2].push([SearchIndexType.TEXT, config.text]);
        });
      } else if (element.tag === "card")
        pageIndex[2].push([
          SearchIndexType.CARD,
          {
            title: element.title,
            desc: element.desc || "",
          },
        ]);
      else if (element.tag === "doc")
        pageIndex[2].push([
          SearchIndexType.DOC,
          {
            name: element.name,
            icon: element.icon,
          },
        ]);
      else if (element.tag === "table") {
        if (element.caption)
          pageIndex[2].push([SearchIndexType.HEADING, element.caption]);

        pageIndex[2].push([
          SearchIndexType.HEADING,
          element.header.join(" | "),
        ]);

        element.body.forEach((row) => {
          pageIndex[2].push([SearchIndexType.TEXT, row.join(" | ")]);
        });
      } else if (element.tag === "account") {
        pageIndex[2].push([SearchIndexType.HEADING, element.name]);
        if (element.detail)
          pageIndex[2].push([SearchIndexType.TEXT, element.detail]);
        if (element.desc)
          pageIndex[2].push([SearchIndexType.TEXT, element.desc]);
      } else if (element.tag === "phone") {
        if (element.header)
          pageIndex[2].push([SearchIndexType.HEADING, element.header]);
        pageIndex[2].push([
          SearchIndexType.TEXT,
          `${element.lName || ""}${element.fName}: ${element.num}`,
        ]);
      }
    });
  });

  return searchMap;
};

const generateFunctionSearchMap = (): SearchMap => {
  const functionSearchData = <
    {
      text: string;
      icon: string;
      url: string;
      tags?: string[];
    }[]
  >load(readFileSync("./data/search/function.yml", { encoding: "utf-8" }));

  const functionSearchMap: SearchMap = {};

  functionSearchData.forEach((item) => {
    if (item.tags)
      functionSearchMap[item.url] = [
        SearchItemType.Page,
        item.text,
        item.icon,
        item.tags,
      ];
    else
      functionSearchMap[item.url] = [SearchItemType.Page, item.text, item.icon];
  });

  return functionSearchMap;
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
  const functionSearchMap = generateFunctionSearchMap();

  // 写入关键词列表
  writeFileSync("./d/guide.json", JSON.stringify(guideSearchMap));
  writeFileSync("./d/intro.json", JSON.stringify(introSearchMap));
  writeFileSync("./d/function.json", JSON.stringify(functionSearchMap));
  writeFileSync(
    "./d/all.json",
    JSON.stringify({
      ...guideSearchMap,
      ...introSearchMap,
      ...functionSearchMap,
    })
  );

  console.log("Search index generated");
};
