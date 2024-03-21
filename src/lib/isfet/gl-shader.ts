export class GlShader {
  private _gl: WebGLRenderingContext;
  private _glShader: WebGLShader;

  public constructor(gl: WebGLRenderingContext, glShaderType: GLenum) {
    const glShader = gl.createShader(glShaderType);

    this._gl = gl;
    this._glShader = glShader;
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

    return gl.getShaderInfoLog(glShader);
  }

  public compile(shaderSource: string) {
    const gl = this._gl;
    const glShader = this._glShader;
    const normalizedShaderSource = shaderSource.trim();

    gl.shaderSource(glShader, normalizedShaderSource);
    gl.compileShader(glShader);
  }
}
