import { GlVertexBuffer } from "./gl-vertex-buffer";
import { IsfProgram } from "./isf-program";

type UniformSetVectorFunctionName =
  | "uniform1fv"
  | "uniform1iv"
  | "uniform2fv"
  | "uniform2iv"
  | "uniform3fv"
  | "uniform3iv"
  | "uniform4fv"
  | "uniform4iv";

export class IsfRenderer {
  private _gl: WebGLRenderingContext;
  private _vertexPositionBuffer: GlVertexBuffer;
  private _isfProgram: IsfProgram;
  private _uniformSetFunctionNames: { [inputName: string]: UniformSetVectorFunctionName } = {};

  public constructor(gl: WebGLRenderingContext) {
    const vertexPositionBuffer = new GlVertexBuffer(gl, gl.STATIC_DRAW, 2, gl.FLOAT);
    vertexPositionBuffer.setData(new Float32Array([-1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0]));

    this._gl = gl;
    this._vertexPositionBuffer = vertexPositionBuffer;
    this._isfProgram = IsfProgram.createFromIsfSource(gl, "void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); }");
  }

  public useIsfProgram(isfProgram: IsfProgram) {
    const gl = this._gl;
    const vertexPositionBuffer = this._vertexPositionBuffer;
    const positionAttributeLocation = isfProgram.attributeLocations.position;

    if (positionAttributeLocation === null) {
      throw new Error("Cannot find position attribute.");
    }

    gl.enableVertexAttribArray(positionAttributeLocation);
    vertexPositionBuffer.bindToAttributeLocation(positionAttributeLocation);

    for (const input of isfProgram.isfMetadata.inputs) {
      if (input.type === "bool") {
        this._uniformSetFunctionNames[input.name] = "uniform1iv";
      } else if (input.type === "long") {
        this._uniformSetFunctionNames[input.name] = "uniform1iv";
      } else if (input.type === "float") {
        this._uniformSetFunctionNames[input.name] = "uniform1fv";
      } else if (input.type === "color") {
        this._uniformSetFunctionNames[input.name] = "uniform4fv";
      }
    }

    isfProgram.use();

    this._isfProgram = isfProgram;
  }

  public clear() {
    const gl = this._gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public setInputValue(name: string, value: number[]) {
    const gl = this._gl;
    const uniformLocation = this._isfProgram.uniformLocations[name];
    const uniformSetVectorFunctionName = this._uniformSetFunctionNames[name];

    if (!uniformSetVectorFunctionName) {
      return;
    }

    gl[uniformSetVectorFunctionName](uniformLocation, value);
  }

  public draw(time: number, renderSizeWidth: number, renderSizeHeight: number) {
    const gl = this._gl;
    const isfProgram = this._isfProgram;

    gl.uniform1f(isfProgram.uniformLocations.TIME, time);
    gl.uniform2f(isfProgram.uniformLocations.RENDERSIZE, renderSizeWidth, renderSizeHeight);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.flush();
  }
}
