import { GlProgram } from "./gl-program";
import { GlShader } from "./gl-shader";

const isfVertexShaderSource = `
attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }
`.trim();

const isfFragmentShaderSourceHeader = `
#define isf_FragNormCoord (gl_FragCoord.xy / RENDERSIZE.xy)

precision mediump float;

uniform vec2 RENDERSIZE;
uniform float TIME;
`.trim();

export class IsfProgram extends GlProgram {
  private _positionAttributeLocation: GLint | null = null;
  private _timeUniformLocation: WebGLUniformLocation | null = null;
  private _renderSizeUniformLocation: WebGLUniformLocation | null = null;

  public static createFromIsfSource(gl: WebGLRenderingContext, isfSource: string) {
    const isfFragmentShaderSource = `${isfFragmentShaderSourceHeader}\n\n${isfSource}`;

    const isfProgram = new IsfProgram(gl);
    const vertexShader = GlShader.createFromSource(gl, gl.VERTEX_SHADER, isfVertexShaderSource);
    const fragmentShader = GlShader.createFromSource(gl, gl.FRAGMENT_SHADER, isfFragmentShaderSource);

    isfProgram.link(vertexShader, fragmentShader);

    return isfProgram;
  }

  public override link(isfVertexShader: GlShader, isfFragmentShader: GlShader) {
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
