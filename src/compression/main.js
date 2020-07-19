/* eslint-disable */

import { fileToPixels, pixelsToFile } from "./image";
import { readFile } from "./read";
import { writeFile } from "./write";
import { encodeImage } from "./encoder";
import { decodeImage } from "./decoder";
import { readToBase64 } from "~/utils/helpers";

export async function encodeFileToFile(src, dist, error) {
  const { r, g, b, width, height } = await fileToPixels(src);
  const encoded = encodeImage(r, g, b, width, height, error);
  await writeFile(encoded, dist);
}

export async function decodeToFile(src, dist, iterations) {
  const { r, g, b, width, height } = await readFile(src);
  const decoded = decodeImage(r, g, b, width, height, iterations);
  await pixelsToFile(decoded.r, decoded.g, decoded.b, width, height, dist);
}

export async function decodedToBase64Array(src, dist, iterations) {
  const { r, g, b, width, height } = await readFile(src);
  const base64Arr = [];
  for (let i = 0; i <= iterations; ++i) {
    const decoded = decodeImage(r, g, b, width, height, i);
    await pixelsToFile(decoded.r, decoded.g, decoded.b, width, height, dist);
    const base64 = await readToBase64(dist);
    base64Arr.push(base64);
  }
  return base64Arr;
}
