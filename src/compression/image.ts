import jimp from "jimp";

async function loadImage(path: string): Promise<RawImage> {
  const image = await jimp.read(path);
  const { width, height, data } = image.bitmap;

  return { data, width, height };
}

function splitToRGB(pixelData: Buffer): RGBRaw {
  const channels = 4;
  const length = pixelData.length / channels;
  const r = new Uint8Array(new ArrayBuffer(length));
  const g = new Uint8Array(new ArrayBuffer(length));
  const b = new Uint8Array(new ArrayBuffer(length));

  for (let i = 0; i < length; i++) {
    const offset = i * channels;
    r[i] = pixelData[offset];
    g[i] = pixelData[offset + 1];
    b[i] = pixelData[offset + 2];
  }

  return { r, g, b };
}

export async function fileToPixels(path: string): Promise<RGBImage> {
  const { data, width, height } = await loadImage(path);

  const { r, g, b } = splitToRGB(data);
  return { r, g, b, width, height };
}

function mergeToRGB(r: Uint8Array, g: Uint8Array, b: Uint8Array): Buffer {
  const pixels = Buffer.alloc(r.length * 3);
  for (let i = 0; i < r.length; i++) {
    pixels[i * 3] = r[i];
    pixels[i * 3 + 1] = g[i];
    pixels[i * 3 + 2] = b[i];
  }

  return pixels;
}

async function saveImage(
  data: Buffer,
  width: number,
  height: number,
  path: string
): Promise<string> {
  // @ts-ignore
  const image = await jimp.create({ data, width, height });

  await image.writeAsync(path);
  const base64 = await image.getBase64Async(image.getMIME());
  return base64;
}

export async function pixelsToFile(
  r: Uint8Array,
  g: Uint8Array,
  b: Uint8Array,
  width: number,
  height: number,
  path: string
): Promise<string> {
  const pixels = mergeToRGB(r, g, b);
  const base64 = await saveImage(pixels, width, height, path);
  return base64;
}
