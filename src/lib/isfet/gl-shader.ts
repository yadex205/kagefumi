import { GlShaderCompileError } from "./gl-shader-compile-error";
import { GlShaderInfoLog } from "./gl-shader-info-log";

export class GlShader {
  private _gl: WebGLRenderingContext;
  private _glShaderType: GLenum;
  private _glShader: WebGLShader;

  public static createFromSource(gl: WebGLRenderingContext, glShaderType: GLenum, source: string) {
    const glShader = new GlShader(gl, glShaderType);
    glShader.compile(source);

    return glShader;
  }

  public constructor(gl: WebGLRenderingContext, glShaderType: GLenum) {
    const glShader = gl.createShader(glShaderType);

    if (!glShader) {
      throw new Error("Cannot create WebGL shader");
    }

    this._gl = gl;
    this._glShaderType = glShaderType;
    this._glShader = glShader;
  }

  public get typeName() {
    const gl = this._gl;

    switch (this._glShaderType) {
      case gl.VERTEX_SHADER: return "vertex";
      case gl.FRAGMENT_SHADER: return "fragment";
      default: return "unknown";
    }
  }

  public get glShader() {
    return this._glShader;
  }

  public get isCompiled(): boolean {
    const gl = this._gl;
    const glShader = this._glShader;

    return gl.getShaderParameter(glShader, gl.COMPILE_STATUS);
  }

  public get glShaderInfoLog() {
    const gl = this._gl;
    const glShader = this._glShader;

    return GlShaderInfoLog.parse(gl.getShaderInfoLog(glShader) ?? "");
  }

  public compile(shaderSource: string) {
    const gl = this._gl;
    const glShader = this._glShader;
    const normalizedShaderSource = shaderSource.trim();

    gl.shaderSource(glShader, normalizedShaderSource);
    gl.compileShader(glShader);

    if (!this.isCompiled) {
      throw new GlShaderCompileError(this.typeName, this.glShaderInfoLog);
    }
  }
}
