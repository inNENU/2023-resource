import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import axios from "axios";
import { toFile } from "qrcode";

import { appIDInfo } from "../info.js";
import {
  getFileList,
  getWechatAccessToken,
  promiseQueue,
} from "../utils/index.js";

const appidList = Object.keys(appIDInfo);

const removeUnneededQRCode = (name: string): void => {
  const fileList = getFileList(`./res/${name}`, ".yml").map((filePath) =>
    filePath.replace(/\.yml$/gu, "")
  );

  appidList.forEach((appid) => {
    const imgList = getFileList(`./qrcode/${appid}/${name}`, ".png").map(
      (filePath) => filePath.replace(/\.png$/gu, "")
    );

    imgList.forEach((imgPath) => {
      if (!fileList.includes(imgPath))
        unlinkSync(`./qrcode/${appid}/${name}/${imgPath}.png`);
    });
  });
};

const getWechatQRCode = (accessToken: string, scene: string): Promise<Buffer> =>
  axios
    .post<Buffer | { errcode: number; errmsg: string }>(
      `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,
      {
        page: "pages/info/info",
        scene,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        auto_color: true,
      },
      { responseType: "arraybuffer" }
    )
    .then(({ data }) => {
      if (Buffer.isBuffer(data)) return data;

      throw new Error("QRCode Error");
    });

const getQRCode = (name: string): Promise<void> => {
  const fileList = getFileList(`./res/${name}`, ".yml").map((filePath) =>
    filePath.replace(/\.yml$/gu, "")
  );

  const promises = appidList.map((appid) => {
    if (Number.isNaN(Number(appid)))
      return getWechatAccessToken(appid).then((accessToken) => {
        const photoPromises = fileList.map(
          (filePath): (() => Promise<void>) =>
            (): Promise<void> => {
              const folderPath = dirname(
                resolve(`./qrcode`, appid, name, filePath)
              );

              if (
                !existsSync(resolve(`./qrcode`, appid, name, `${filePath}.png`))
              ) {
                console.log(`${appid}: ${name}/${filePath}.png 不存在`);

                // 创建文件夹
                if (!existsSync(folderPath))
                  mkdirSync(folderPath, { recursive: true });

                const scene = `${
                  name === "guide"
                    ? "G"
                    : name === "intro"
                    ? "I"
                    : name === "other"
                    ? "O"
                    : ""
                }${filePath.replace(/\/index$/, "/")}`;

                // 判断 scene 长度
                if (scene.length > 32) {
                  console.error(
                    `\nLong Scene: ${scene} with length ${scene.length}\n`
                  );

                  return new Promise((resolve) => resolve());
                }

                return getWechatQRCode(accessToken, scene)
                  .then((data) => {
                    console.log(`${appid}: ${name}/${filePath}.png 下载完成`);

                    writeFileSync(
                      resolve(`./qrcode`, appid, name, `${filePath}.png`),
                      data
                    );

                    console.log(`${appid}: ${name}/${filePath}.png 写入完成`);
                  })
                  .catch(() => {
                    console.error(`${appid}: ${name}/${filePath}.png 下载出错`);
                  });
              } else return new Promise((resolve) => resolve());
            }
        );

        return promiseQueue(photoPromises, 5);
      });

    const photoPromises = fileList.map(
      (filePath): (() => Promise<void>) =>
        (): Promise<void> => {
          const folderPath = dirname(
            resolve(`./qrcode`, appid, name, filePath)
          );

          if (
            !existsSync(resolve(`./qrcode`, appid, name, `${filePath}.png`))
          ) {
            console.log(`${appid}: ${filePath}.png 不存在`);
            if (!existsSync(folderPath))
              mkdirSync(folderPath, { recursive: true });

            return toFile(
              resolve(`./qrcode`, appid, name, `${filePath}.png`),
              `https://m.q.qq.com/a/p/${appid}?s=${encodeURI(
                `pages/info/info?path=/${filePath}`
              )}`
            ).then(() => {
              console.log(`${appid}: ${name}/${filePath}.png 生成完成`);
            });
          } else return new Promise((resolve) => resolve());
        }
    );

    return promiseQueue(photoPromises, 5);
  });

  return Promise.all(promises).then(() => {
    console.log(`${name} QRCode generated`);
  });
};

export const generateQRCode = (): Promise<void[]> =>
  Promise.all(
    ["guide", "intro", "other"].map((name) => {
      removeUnneededQRCode(name);

      return getQRCode(name);
    })
  );
