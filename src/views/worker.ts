// import { encodeFileToFile } from "~/compression/main";

// async function work({ src, dist, allowedError }) {
//   console.log("child", self);
//   await encodeFileToFile(src, dist, allowedError);

//   self.postMessage(true);
// }

// self.onmessage = async function (event) {
//   self.postMessage("hi");
//   alert(event.data);
//   console.log("Received message " + event.data);
//   await work(event.data);
// };

// self.terminate();

import { ipcRenderer } from "electron";

const message2UI = (command: string, payload: any): void => {
  ipcRenderer.send("message-from-worker", {
    command: command,
    payload: payload,
  });
};
message2UI("helloWorld", { myParam: 1337, anotherParam: 42 });
