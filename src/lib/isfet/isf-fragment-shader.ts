import { GlShader } from "./gl-shader";

const isfFragmentShaderHeader = `
#define isf_FragNormCoord (gl_FragCoord.xy / RENDERSIZE.xy)

precision mediump float;

uniform vec2 RENDERSIZE;
uniform float TIME;
`.trim();

export class IsfFragmentShader extends GlShader {
  public constructor(gl: WebGLRenderingContext) {
    super(gl, gl.FRAGMENT_SHADER);
  }

  public override compile(isfSource: string) {
    const shaderSource = `${isfFragmentShaderHeader}\n\n${isfSource}`;

    super.compile(shaderSource);
  }
}
