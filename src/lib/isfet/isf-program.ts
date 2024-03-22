import { GlProgram } from "./gl-program";
import { IsfVertexShader } from "./isf-vertex-shader";
import { IsfFragmentShader } from "./isf-fragment-shader";

export class IsfProgram extends GlProgram {
  private _positionAttributeLocation: GLint | null = null;
  private _timeUniformLocation: WebGLUniformLocation | null = null;
  private _renderSizeUniformLocation: WebGLUniformLocation | null = null;

  public override link(isfVertexShader: IsfVertexShader, isfFragmentShader: IsfFragmentShader) {
    super.link(isfVertexShader, isfFragmentShader);

    this._positionAttributeLocation = this.getAttributeLocation("position");
    this._timeUniformLocation = this.getUniformLocation("TIME");
    this._renderSizeUniformLocation = this.getUniformLocation("RENDERSIZE");
  }

  public get positionAttributeLocation() {
    return this._positionAttributeLocation;
  }

  public get timeUniformLocation() {
    return this._timeUniformLocation;
  }

  public get renderSizeUniformLocation() {
    return this._renderSizeUniformLocation;
  }
}
