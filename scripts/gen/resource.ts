import { execSync } from "child_process";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { type } from "node:os";

import { deleteSync } from "del";

// 生成排列组合
const getCombine = <T = string>(
  list: T[],
  index = 0,
  result: T[][] = []
): T[][] => {
  if (list.length === 0) return [];
  const temp: T[][] = [[list[index]]];

  for (let i = 0; i < result.length; i++)
    temp.push(result[i].concat(list[index]));

  if (index === list.length - 1) return result.concat(temp);

  return getCombine(list, index + 1, result.concat(temp));
};

const getUpdateCombine = <T = string>(
  updateList: T[],
  fullList: T[][]
): T[][] =>
  fullList.filter((list) =>
    list.some((item) => updateList.some((updateItem) => updateItem === item))
  );

export const zipFiles = (folderLocation: string, folderName: string): void => {
  /** 文件名 */

  deleteSync(`./temp/${folderName}.zip`);

  // 压缩文件
  if (type() === "Linux")
    execSync(
      `zip -r ${folderLocation}/${folderName}.zip ${folderLocation}/${folderName}}`
    );
  else if (type() === "Windows_NT") {
    execSync(
      `cd ./${folderLocation} && "../assets/lib/7za" a -r ${folderName}.zip ${`"${folderName}/"`} && cd ..`
    );
    execSync(`mv ./${folderLocation}/${folderName}.zip ./temp`);
  } else throw new Error("Mac OS is not supported");
};

export const generateResource = (): void => {
  /** 资源列表 */
  const resourceList = ["function", "guide", "icon", "intro"];
  /** 差异列表 */
  const diffResult = execSync("git status -s").toString();

  /** 版本信息 */
  const versionInfo = <
    { version: Record<string, number>; size: Record<string, number> }
  >JSON.parse(readFileSync("./r/version.json", { encoding: "utf-8" }));
  /** 更新列表 */
  const updateList: string[] = [];

  resourceList.forEach((name) => {
    // 更新版本号
    if (diffResult.includes(` r/${name}/`)) {
      updateList.push(name);
      versionInfo.version[name] += 1;
    }
  });

  // 生成 zip 并统计大小
  getUpdateCombine(updateList, getCombine(resourceList)).forEach(
    (resCombine) => {
      zipFiles(resCombine);

      const fileName = resCombine.join("-");

      versionInfo.size[fileName] = Math.round(
        statSync(`./r/${fileName}.zip`).size / 1024
      );
    }
  );

  // 写入版本信息
  writeFileSync("./r/version.json", JSON.stringify(versionInfo), {
    encoding: "utf-8",
  });
};
