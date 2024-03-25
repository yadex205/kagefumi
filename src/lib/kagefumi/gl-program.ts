import { GlShader } from "./gl-shader";

export class GlProgram {
  protected _gl: WebGLRenderingContext;
  private _glProgram: WebGLProgram;

  public constructor(gl: WebGLRenderingContext) {
    const glProgram = gl.createProgram();

    if (!glProgram) {
      throw new Error("Cannot create WebGL program.");
    }

    this._gl = gl;
    this._glProgram = glProgram;
  }

  public get isLinked(): GLboolean {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getProgramParameter(glProgram, gl.LINK_STATUS);
  }

  public get isDeleted(): GLboolean {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getProgramParameter(glProgram, gl.DELETE_STATUS);
  }

  public get glProgramInfoLog() {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getProgramInfoLog(glProgram);
  }

  public link(vertexShader: GlShader, fragmentShader: GlShader) {
    const gl = this._gl;
    const glProgram = this._glProgram;

    gl.attachShader(glProgram, vertexShader.glShader);
    gl.attachShader(glProgram, fragmentShader.glShader);
    gl.linkProgram(glProgram);

    if (!this.isLinked) {
      throw new Error(`Cannot link WebGL program.\n${this.glProgramInfoLog}`);
    }
  }

  public use() {
    const gl = this._gl;
    const glProgram = this._glProgram;

    gl.useProgram(glProgram);
  }

  public destroy() {
    const gl = this._gl;
    const glProgram = this._glProgram;

    gl.deleteProgram(glProgram);
  }

  public getAttributeLocation(attributeName: string) {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getAttribLocation(glProgram, attributeName);
  }

  public getUniformLocation(uniformName: string) {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getUniformLocation(glProgram, uniformName);
  }
}
