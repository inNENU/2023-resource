import { execSync } from "node:child_process";
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

  const files = finalDiffResult
    .split("\n")
    .filter(
      (item) =>
        item.startsWith("img/") ||
        item.startsWith("file/") ||
        (item.startsWith("r/") && item.endsWith(".zip"))
    );

  const updatedFiles = files
    .filter((item) => !item.substring(0, 3).includes("D"))
    .map((item) => item.substring(3));
  const deletedFiles = files
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
    "x-oss-object-acl": "public-read",
  };

  const putFile = async (filePath: string): Promise<void> => {
    try {
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

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      const result = await client.delete(filePath);

      if (result.res.status !== 200)
        console.log(`${filePath} delete failed:`, result.res.status);
    } catch (err) {
      console.error(`${filePath} delete failed:`, err);
    }
  };

  await Promise.all([
    ...updatedFiles.map(async (item) => {
      await putFile(item);
    }),
    ...deletedFiles.map(async (item) => {
      await deleteFile(item);
    }),
  ]);
};

await syncOSS();
