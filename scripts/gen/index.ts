import { execSync } from "node:child_process";
import { deleteSync } from "del";

import { checkAccount, checkAccountDetail } from "./account.js";
import { count } from "./count.js";
import { genDonate } from "./donate.js";
import { genEnrollPlan } from "./enroll-plan.js";
import { genIcon } from "./icon.js";
import { genLyric } from "./lyric.js";
import { checkMusic } from "./music.js";
import { genPEScore } from "./peScore.js";
import { genQRCode } from "./qrcode.js";
import { genSearchMap } from "./search.js";
import { resolveLocationPage } from "./map.js";
import { resolveMarker } from "./marker.js";
import { generateResource } from "./resource.js";
import { resolvePage } from "../components/page.js";
import { convertYml2Json } from "../utils/index.js";

import type { AccountConfig, AccountDetail } from "./account.js";
import type { Donate } from "./donate.js";
import type { PEConfig } from "./peScore.js";
import type { MarkerOption } from "./marker.js";
import type { MusicInfo } from "./music.js";
import type { PageConfig } from "../components/typings.js";

// 删除旧的文件
deleteSync([
  "./r/function/**",
  "./r/guide/**",
  "./r/intro/**",
  "./r/icon/**",
  "./r/other/**",
]);

// 生成对应的 JSON

// 转换账号
convertYml2Json("./res/account", "./r/account", (data, filePath) =>
  checkAccountDetail(data as AccountDetail, filePath)
);

// 功能大厅
convertYml2Json("./res/function", "./r/function", (data, filePath) =>
  /map\/marker\/(benbu|jingyue)/u.exec(filePath)
    ? resolveMarker(data as MarkerOption)
    : /map\/(benbu|jingyue)\//u.exec(filePath)
    ? resolveLocationPage(
        data as PageConfig & { photo?: string[] },
        `function/${filePath}`
      )
    : /pe-calculator\/(male|female)-(low|high)/u.exec(filePath)
    ? genPEScore(data as PEConfig)
    : /account\//u.exec(filePath)
    ? checkAccount(data as AccountConfig[], filePath)
    : /music\/index/u.exec(filePath)
    ? checkMusic(data as MusicInfo[], filePath)
    : (data as unknown)
);

/** 差异列表 */
const diffResult = execSync("git status -s").toString();

// 东师介绍
convertYml2Json("./res/intro", "./r/intro", (data, filePath) =>
  resolvePage(data as PageConfig, `intro/${filePath}`, diffResult)
);

// 东师指南
convertYml2Json("./res/guide", "./r/guide", (data, filePath) =>
  resolvePage(data as PageConfig, `guide/${filePath}`, diffResult)
);

// 其他文件
convertYml2Json("./res/other", "./r/other", (data, filePath) =>
  resolvePage(data as PageConfig, `other/${filePath}`, diffResult)
);

// 生成转码后的图标
genIcon();

// 生成搜索索引
genSearchMap();

// 生成歌词
genLyric();

// 生成招生计划信息
genEnrollPlan();

// 生成捐赠
convertYml2Json("./res/config/donate", "./r/other/donate", (data, filePath) =>
  genDonate(data as Donate, filePath)
);

// 生成 Sitemap
// genSitemap();
count();

// 重新生成 guide
convertYml2Json("./res/other/guide", "./r/other/guide", (data, filePath) =>
  resolvePage(data as PageConfig, filePath)
);

// 生成 tab 页
convertYml2Json("./res/config", "./r/config", (data, filePath) =>
  /(function|guide|intro|main|user)/u.exec(filePath)
    ? resolvePage(data as PageConfig, filePath)
    : (data as unknown)
);

// 生成资源
generateResource();

// 生成二维码
await genQRCode();

console.log("All completed");
