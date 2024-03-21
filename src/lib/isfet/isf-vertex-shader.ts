import { GlShader } from "./gl-shader";

export class IsfVertexShader extends GlShader {
  public static shaderSource = "attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }";

  public constructor(gl: WebGLRenderingContext) {
    super(gl, gl.VERTEX_SHADER);
  }

  public override compile() {
    super.compile(IsfVertexShader.shaderSource);
  }
}
