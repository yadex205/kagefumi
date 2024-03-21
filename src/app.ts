import { Isfet } from "./lib/isfet";

const basicIsfSource = `
void main() {
  gl_FragColor = vec4(0.6, 0.6, 0.6, 1.0);
}
`.trim();

window.addEventListener("load", () => {
  const isfetCanvasEl = document.querySelector<HTMLCanvasElement>("#isfet-canvas");
  const gl = isfetCanvasEl.getContext("webgl");

  const isfet = new Isfet(gl);
  isfet.createIsfProgram("basic", basicIsfSource);
  isfet.useIsfProgram("basic");

  isfet.start();
});
