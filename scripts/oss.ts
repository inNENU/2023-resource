import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import OSS from "ali-oss";
import { config } from "dotenv";

config();

const __dirname = path.dirname(
  path.join(fileURLToPath(import.meta.url), "../")
);

const syncOSS = async (): Promise<void> => {
  const finalDiffResult = execSync("git status -s").toString();
  const updateZipFileInfo = readFileSync("./d/oss-update", {
    encoding: "utf-8",
  });
  const updateZipFiles = updateZipFileInfo.split("\n").filter((item) => item);
  const assetsFiles = finalDiffResult.split("\n").filter((item) => {
    const filename = item.substring(3);

    return filename.startsWith("img/") || filename.startsWith("file/");
  });

  const updatedFiles = assetsFiles
    .filter((item) => !item.substring(0, 3).includes("D"))
    .map((item) => item.substring(3));
  const deletedFiles = assetsFiles
    .filter((item) => item.substring(0, 3).includes("D"))
    .map((item) => item.substring(3));

  const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: process.env.OSS_KEY_ID!,
    accessKeySecret: process.env.OSS_KEY_SECRET!,
    bucket: "innenu",
    secure: true,
  });

  const headers = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "x-oss-storage-class": "Standard",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "x-oss-object-acl": "private",
  };

  const putFile = async (filePath: string): Promise<void> => {
    try {
      console.log(`Putting file ${filePath}`);
      const result = await client.put(
        filePath,
        path.normalize(path.join(__dirname, filePath)),
        { headers }
      );

      if (result.res.status !== 200)
        console.log(`${filePath} upload failed:`, result.res.status);
    } catch (err) {
      console.error(`${filePath} upload failed:`, err);
    }
  };

  const deleteFiles = async (filePaths: string[]): Promise<void> => {
    try {
      if (filePaths.length === 0) return;

      const result = await client.deleteMulti(filePaths);

      if (result.res.status !== 200)
        console.log(`delete failed:`, result.res.status);
    } catch (err) {
      console.error(`delete failed:`, err);
    }
  };

  await Promise.all([
    ...updateZipFiles.map((item) => putFile(`d/${item}.zip`)),
    ...updatedFiles.map((item) => putFile(item)),
    deleteFiles(deletedFiles),
  ]);
};

await syncOSS();
