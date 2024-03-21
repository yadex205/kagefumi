import { GlShader } from "./gl-shader";

export class GlProgram {
  private _gl: WebGLRenderingContext;
  private _glProgram: WebGLProgram;

  public constructor(gl: WebGLRenderingContext) {
    const glProgram = gl.createProgram();

    this._gl = gl;
    this._glProgram = glProgram;
  }

  protected get gl() {
    return this._gl;
  }

  public get isLinked(): boolean {
    const gl = this._gl;
    const glProgram = this._glProgram;

    return gl.getProgramParameter(glProgram, gl.LINK_STATUS);
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
  }

  public use() {
    const gl = this._gl;
    const glProgram = this._glProgram;

    gl.useProgram(glProgram);
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
