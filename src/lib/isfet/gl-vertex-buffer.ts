export class GlVertexBuffer {
  private _gl: WebGLRenderingContext;
  private _glBuffer: WebGLBuffer;
  private _usage: GLenum;
  private _attributeSize: GLint;
  private _dataType: GLenum;

  public constructor(gl: WebGLRenderingContext, usage: GLenum, attributeSize: GLint, dataType: GLenum) {
    const glBuffer = gl.createBuffer();

    if (!glBuffer) {
      throw new Error("Cannot create WebGL buffer.");
    }

    this._gl = gl;
    this._glBuffer = glBuffer;
    this._usage = usage;
    this._attributeSize = attributeSize;
    this._dataType = dataType;
  }

  public setData(data: BufferSource) {
    const gl = this._gl;
    const glBuffer = this._glBuffer;
    const usage = this._usage;

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }

  public bindToAttributeLocation(attributeLocation: GLuint) {
    const gl = this._gl;
    const glBuffer = this._glBuffer;
    const attributeSize = this._attributeSize;
    const dataType = this._dataType;

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.vertexAttribPointer(attributeLocation, attributeSize, dataType, false, 0, 0);
  }
}
