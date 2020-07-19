import { app, BrowserWindow, nativeTheme, ipcMain } from "electron";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
let mainWindow: BrowserWindow, workerWindow: BrowserWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // nodeIntegrationInWorker: true,
    },
    frame: false,
    backgroundColor: "#2e2c29",
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true },
  });
  workerWindow.loadFile(path.resolve("worker.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    nativeTheme.themeSource = "dark";
  }
});
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function sendWindowMessage(
  targetWindow: BrowserWindow,
  message: string,
  payload: any
): void {
  if (typeof targetWindow === "undefined") {
    console.log("Target window does not exist");
    return;
  }
  targetWindow.webContents.send(message, payload);
}

app.on("ready", async () => {
  ipcMain.on("message-from-worker", (event, arg) => {
    console.log("event", event);
    sendWindowMessage(mainWindow, "message-from-worker", arg);
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
