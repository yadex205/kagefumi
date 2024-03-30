import { IsfProgram } from "./isf-program";
import { IsfRenderer } from "./isf-renderer";

export type { IsfInput } from "./isf-metadata";

export class Kagefumi {
  private _gl: WebGLRenderingContext;
  private _isfRenderer: IsfRenderer;
  private _isfProgram?: IsfProgram;
  private _intervalHandle = 0;
  private _startTimeMs = 0;

  public constructor(gl: WebGLRenderingContext) {
    const isfRenderer = new IsfRenderer(gl);

    this._gl = gl;
    this._isfRenderer = isfRenderer;
  }

  public get isfMetadata() {
    return this._isfProgram?.isfMetadata;
  }

  public setIsfProgram(isfSource: string) {
    const gl = this._gl;
    const isfRenderer = this._isfRenderer;
    const oldIsfProgram = this._isfProgram;

    const newIsfProgram = IsfProgram.createFromIsfSource(gl, isfSource);
    isfRenderer.useIsfProgram(newIsfProgram);

    if (oldIsfProgram) {
      oldIsfProgram.destroy({ destroyShaders: true });
    }

    this._isfProgram = newIsfProgram;
  }

  public setInputValue(name: string, value: number[]) {
    this._isfRenderer.setInputValue(name, value);
  }

  public start() {
    const interval = 1000 / 60;

    window.clearInterval(this._intervalHandle);

    this._startTimeMs = Date.now();
    this._intervalHandle = window.setInterval(this.draw.bind(this), interval);
  }

  private draw() {
    const gl = this._gl;
    const isfRenderer = this._isfRenderer;
    const startTimeMs = this._startTimeMs;

    const time = (Date.now() - startTimeMs) / 1000;

    isfRenderer.draw(time, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}
