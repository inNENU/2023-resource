import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import OSS from "ali-oss";

const __dirname = path.dirname(
  path.join(fileURLToPath(import.meta.url), "../../"),
);

console.log(__dirname);

export const syncOSS = async (): Promise<void> => {
  const finalDiffResult = execSync("git status -s").toString();

  const files = finalDiffResult
    .split("\n")
    .filter((item) => item.trim().length)
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

  const put = async (filePath: string): Promise<void> => {
    try {
      const result = await client.put(
        filePath,
        path.normalize(path.join(__dirname, filePath)),
        { headers },
      );

      if (result.res.status !== 200)
        console.log(`${filePath} upload failed:`, result.res.status);
    } catch (err) {
      console.error(`${filePath} upload failed:`, err);
    }
  };

  await Promise.all(
    files.map(async (item) => {
      if (
        item.startsWith("img/") ||
        item.startsWith("file/") ||
        (item.startsWith("r/") && item.endsWith(".zip"))
      )
        await put(item);
    }),
  );
};
