import { IsfProgram } from "./isf-program";
import { IsfRenderer } from "./isf-renderer";

export class Kagefumi {
  private _gl: WebGLRenderingContext;
  private _isfRenderer: IsfRenderer;
  private _isfPrograms: Map<string, IsfProgram> = new Map();
  private _currentIsfProgram?: IsfProgram;
  private _intervalHandle = 0;
  private _startTimeMs = 0;

  public constructor(gl: WebGLRenderingContext) {
    const isfRenderer = new IsfRenderer(gl);

    this._gl = gl;
    this._isfRenderer = isfRenderer;
  }

  public get isfMetadata() {
    return this._currentIsfProgram?.isfMetadata;
  }

  public setIsfProgram(name: string, isfSource: string) {
    const gl = this._gl;
    const isfRenderer = this._isfRenderer;
    const currentIsfProgram = this._currentIsfProgram;

    const oldIsfProgram = this._isfPrograms.get(name);
    const newIsfProgram = IsfProgram.createFromIsfSource(gl, isfSource);

    this._isfPrograms.set(name, newIsfProgram);

    if (oldIsfProgram) {
      if (oldIsfProgram === currentIsfProgram) {
        isfRenderer.useIsfProgram(newIsfProgram);
      }

      oldIsfProgram.destroy({ destroyShaders: true });
    }
  }

  public useIsfProgram(name: string) {
    const isfRenderer = this._isfRenderer;
    const isfProgram = this._isfPrograms.get(name);

    if (!isfProgram) {
      return;
    }

    isfRenderer.useIsfProgram(isfProgram);
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
