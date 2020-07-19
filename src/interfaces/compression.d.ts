declare interface RawImage {
  data: Buffer;
  height: number;
  width: number;
}

declare interface RGBRaw {
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
}

declare interface RGBImage extends RGBRaw {
  height: number;
  width: number;
}
