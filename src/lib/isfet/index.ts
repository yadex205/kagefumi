import { IsfVertexShader } from "./isf-vertex-shader";
import { IsfFragmentShader } from "./isf-fragment-shader";
import { IsfProgram } from "./isf-program";
import { IsfRenderer } from "./isf-renderer";

export class Isfet {
  private _gl: WebGLRenderingContext;
  private _isfPrograms: Map<string, IsfProgram> = new Map();
  private _isfRenderer: IsfRenderer;
  private _intervalHandle = 0;
  private _startTimeMs = 0;

  public constructor(gl: WebGLRenderingContext) {
    const isfRenderer = new IsfRenderer(gl);

    this._gl = gl;
    this._isfRenderer = isfRenderer;
  }

  public createIsfProgram(name: string, isfSource: string) {
    const gl = this._gl;

    const isfVertexShader = new IsfVertexShader(gl);
    const isfFragmentShader = new IsfFragmentShader(gl);
    const isfProgram = new IsfProgram(gl);

    isfVertexShader.compile();
    isfFragmentShader.compile(isfSource);
    isfProgram.link(isfVertexShader, isfFragmentShader);

    this._isfPrograms.set(name, isfProgram);
  }

  public useIsfProgram(name: string) {
    const isfRenderer = this._isfRenderer;
    const isfProgram = this._isfPrograms.get(name);

    if (!isfProgram) {
      return;
    }

    isfRenderer.useIsfProgram(isfProgram);
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
