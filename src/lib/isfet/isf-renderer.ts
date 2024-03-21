import { GlVertexBuffer } from "./gl-vertex-buffer";
import { IsfProgram } from "./isf-program";

export class IsfRenderer {
  private _gl: WebGLRenderingContext;
  private _vertexPositionBuffer: GlVertexBuffer;
  private _isfProgram: IsfProgram;

  public constructor(gl: WebGLRenderingContext) {
    const vertexPositionBuffer = new GlVertexBuffer(gl, gl.STATIC_DRAW, 2, gl.FLOAT);
    vertexPositionBuffer.setData(new Float32Array([-1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0]));

    this._gl = gl;
    this._vertexPositionBuffer = vertexPositionBuffer;
  }

  public useIsfProgram(isfProgram: IsfProgram) {
    const gl = this._gl;
    const vertexPositionBuffer = this._vertexPositionBuffer;

    gl.enableVertexAttribArray(isfProgram.positionAttributeLocation);
    vertexPositionBuffer.bindToAttributeLocation(isfProgram.positionAttributeLocation);

    isfProgram.use();

    this._isfProgram = isfProgram;
  }

  public clear() {
    const gl = this._gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public draw(time: number, renderSizeWidth: number, renderSizeHeight: number) {
    const gl = this._gl;
    const isfProgram = this._isfProgram;

    gl.uniform1f(isfProgram.timeUniformLocation, time);
    gl.uniform2f(isfProgram.renderSizeUniformLocation, renderSizeWidth, renderSizeHeight);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.flush();
  }
}
