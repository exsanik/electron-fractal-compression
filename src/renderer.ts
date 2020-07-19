import { Titlebar, Color } from "custom-electron-titlebar";

import "./views/index.css";

import "jquery/dist/jquery.slim";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-slider/dist/css/bootstrap-slider.min.css";

import "./views/index.ts";

new Titlebar({
  backgroundColor: Color.fromHex("#212121"),
});

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);
