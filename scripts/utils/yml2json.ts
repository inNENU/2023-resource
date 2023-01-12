import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { load } from "js-yaml";
import { getFileList } from "./file.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertYml2Json = <T = any>(
  sourceFolder: string,
  targetFolder = sourceFolder,
  convertFunction: (data: T, filePath: string) => T = (data): T => data,
  dir = ""
): void => {
  const fileList = getFileList(sourceFolder, "yml");

  fileList.forEach((filePath) => {
    const folderPath = dirname(resolve(targetFolder, filePath));

    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8",
    });
    const json = load(content) as T;

    writeFileSync(
      resolve(targetFolder, filePath.replace(/\.yml/u, ".json")),
      JSON.stringify(
        convertFunction(
          json,
          relative("./", resolve(dir, filePath.replace(/\.yml/u, ""))).replace(
            /\\/gu,
            "/"
          )
        )
      ),
      { encoding: "utf-8" }
    );
  });
};
