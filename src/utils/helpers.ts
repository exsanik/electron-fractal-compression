import jimp from "jimp";

export const readToBase64 = async (path: string): Promise<string> => {
  try {
    const image = await jimp.create(path);
    const base64 = await image.getBase64Async(image.getMIME());
    return base64;
  } catch (err) {
    console.log("err", err);
    return err.message;
  }
};
