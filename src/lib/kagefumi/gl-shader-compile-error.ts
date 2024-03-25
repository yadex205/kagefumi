import { GlShaderInfoLog } from "./gl-shader-info-log";

export class GlShaderCompileError extends Error {
  private _glShaderInfoLog: GlShaderInfoLog;

  public constructor(shaderTypeName: string, glShaderInfoLog: GlShaderInfoLog) {
    const message = `Cannot compile ${shaderTypeName} shader.\n${glShaderInfoLog}`;

    super(message);

    this.name = "GlShaderCompileError";
    this._glShaderInfoLog = glShaderInfoLog;
  }

  public get glShaderInfoLog() {
    return this._glShaderInfoLog;
  }
}
