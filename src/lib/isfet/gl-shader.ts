export class GlShader {
  private _gl: WebGLRenderingContext;
  private _glShaderType: GLenum;
  private _glShader: WebGLShader;

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

    return gl.getShaderInfoLog(glShader);
  }

  public compile(shaderSource: string) {
    const gl = this._gl;
    const glShader = this._glShader;
    const normalizedShaderSource = shaderSource.trim();

    gl.shaderSource(glShader, normalizedShaderSource);
    gl.compileShader(glShader);

    if (!this.isCompiled) {
      throw new Error(`Failed to compile ${this.typeName} shader.\n${this.glShaderInfoLog}`);
    }
  }
}
