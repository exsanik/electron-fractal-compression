import { remote } from "electron";
import fs from "fs";
import Slider from "bootstrap-slider/dist/bootstrap-slider.min.js";
import { encodeFileToFile, decodedToBase64Array } from "~/compression/main";

import { readToBase64 } from "~/utils/helpers";

const uploadFile = document.querySelector("#load-image");
const compressBtn: HTMLButtonElement = document.querySelector("#compress");
const decompressBtn: HTMLButtonElement = document.querySelector("#decompress");
const decompressedImage: HTMLImageElement = document.querySelector(
  "#decompressed"
);
const decompressBlock = document.querySelector("#decompress-block");

new Slider("#iterations", {});
new Slider("#compare-error", {});
let sliderDecompress = new Slider("#decompress-slider", {});
const iterationsSlider: HTMLInputElement = document.querySelector(
  "input#iterations"
);
const compareErrorSlider: HTMLInputElement = document.querySelector(
  "input#compare-error"
);
const decompressSlider: HTMLInputElement = document.querySelector(
  "input#decompress-slider"
);

const spinner = document.querySelector("#spinner");
let base64Arr: Array<string>;

let filepath: string | undefined = undefined;
uploadFile.addEventListener("click", async () => {
  let file: Electron.OpenDialogReturnValue;
  const isMac = process.platform === "darwin";

  try {
    file = await remote.dialog.showOpenDialog({
      title: "Select the File to be uploaded",
      defaultPath: __dirname,
      buttonLabel: "Upload",
      filters: [
        {
          name: "Bitmap",
          extensions: ["bmp"],
        },
      ],
      properties: isMac ? ["openFile", "openDirectory"] : ["openFile"],
    });
    if (!file.canceled) {
      filepath = file.filePaths[0].toString();
    }
  } catch (err) {
    console.log("err", err);
  }

  if (filepath && !file.canceled) {
    const base64 = await readToBase64(filepath);
    const img: HTMLImageElement = document.querySelector("#show-image");
    img.src = base64;
    img.classList.remove("d-none");
    compressBtn.classList.remove("d-none");

    console.log("filepath", filepath);
    fs.watch(filepath, () => {
      fs.stat(filepath, (err, stats) => {
        // document.querySelector(
        //   "#source-file"
        // ).innerHTML = `Source file size ${stats.size} bytes`;
      });
    });
  }
});

compressBtn.onclick = async (): Promise<void> => {
  // const worker = new Worker(path.resolve(__dirname, "worker.js"));

  const error = compareErrorSlider.value;

  const outputFilePath = "./out/out.fractal";
  spinner.classList.remove("d-none");
  await encodeFileToFile(filepath, outputFilePath, error);
  spinner.classList.add("d-none");

  fs.watch(outputFilePath, () => {
    fs.stat(outputFilePath, (err, stats) => {
      console.log("object", stats.size);
      // document.querySelector(
      //   "#compressed-file"
      // ).innerHTML = `Compressed file size ${stats.size} bytes`;
    });
  });

  // worker.postMessage({
  //   src: ,
  //   dist:,
  //   allowedError: ,
  // });
  // console.log("posted");

  // return await new Promise(
  //   (resolve) =>
  //     (worker.onmessage = () => {
  //       return resolve();
  //     })
  // );
};

decompressBtn.onclick = async (): Promise<void> => {
  const iterations = iterationsSlider.value;

  let filepath: string;
  let file: Electron.OpenDialogReturnValue;
  const isMac = process.platform === "darwin";

  try {
    file = await remote.dialog.showOpenDialog({
      title: "Select the File to be uploaded",
      defaultPath: __dirname,
      buttonLabel: "Upload",
      filters: [
        {
          name: "Fractal",
          extensions: ["fractal"],
        },
      ],
      properties: isMac ? ["openFile", "openDirectory"] : ["openFile"],
    });
    if (!file.canceled) {
      filepath = file.filePaths[0].toString();
    }
  } catch (err) {
    console.log("err", err);
  }

  if (filepath && !file.canceled) {
    spinner.classList.remove("d-none");
    sliderDecompress.destroy();
    sliderDecompress = new Slider("#decompress-slider", { max: iterations });

    base64Arr = await decodedToBase64Array(
      filepath,
      "./out/out.bmp",
      iterations
    );
    spinner.classList.add("d-none");
    decompressBlock.classList.remove("d-none");
    decompressBlock.classList.add("d-flex");
    decompressedImage.src = base64Arr[0];
  }
};

// @ts-ignore
decompressSlider.onchange = ({ value }): void => {
  decompressedImage.src = base64Arr[value.newValue];
};
