import { GlProgram, GlShader } from "@kagefumi/kage";
import { IsfMetadata } from "./isf-metadata";

const IsfVertexShaderSource = `
attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }
`.trim();

const IsfFragmentShaderSourceHeader = `
#define isf_FragNormCoord (gl_FragCoord.xy / RENDERSIZE.xy)

precision mediump float;

uniform vec2 RENDERSIZE;
uniform float TIME;
`.trim();

export class IsfProgram extends GlProgram {
  private _isfMetadata: Readonly<IsfMetadata> = Object.freeze(new IsfMetadata());
  private _attributeLocations: { [key: string]: GLint | null } = Object.freeze({});
  private _uniformLocations: { [key: string]: WebGLUniformLocation | null } = Object.freeze({});

  public static createFromIsfSource(gl: WebGLRenderingContext, isfSource: string) {
    const isfProgram = new IsfProgram(gl);
    isfProgram.loadIsfSource(isfSource);

    return isfProgram;
  }

  private static buildIsfFragmentShaderSource(isfSource: string, isfMetadata: Readonly<IsfMetadata>) {
    const additionalUniformLines = isfMetadata.inputs.map((input) => {
      switch (input.type) {
        case "bool":
          return `uniform bool ${input.name};`;
        case "long":
          return `uniform int ${input.name};`;
        case "float":
          return `uniform float ${input.name};`;
        case "color":
          return `uniform vec4 ${input.name};`;
        default:
          ("");
      }
    });

    return `${IsfFragmentShaderSourceHeader}\n\n${additionalUniformLines.join("\n")}\n\n${isfSource}`;
  }

  public get isfMetadata() {
    return this._isfMetadata;
  }

  public get attributeLocations() {
    return this._attributeLocations;
  }

  public get uniformLocations() {
    return this._uniformLocations;
  }

  public loadIsfSource(isfSource: string) {
    const gl = this._gl;
    const isfMetadata = Object.freeze(IsfMetadata.parseIsfSource(isfSource));
    const isfVertexShaderSource = IsfVertexShaderSource;
    const isfFragmentShaderSource = IsfProgram.buildIsfFragmentShaderSource(isfSource, isfMetadata);

    const vertexShader = GlShader.createFromSource(gl, gl.VERTEX_SHADER, isfVertexShaderSource);
    const fragmentShader = GlShader.createFromSource(gl, gl.FRAGMENT_SHADER, isfFragmentShaderSource);

    try {
      this.link(vertexShader, fragmentShader);
    } catch (e) {
      vertexShader.destroy();
      fragmentShader.destroy();
      throw e;
    }

    const attributeLocations: { [key: string]: GLint | null } = {
      position: this.getAttributeLocation("position"),
    };

    const uniformLocations: { [key: string]: WebGLUniformLocation | null } = {
      TIME: this.getUniformLocation("TIME"),
      RENDERSIZE: this.getUniformLocation("RENDERSIZE"),
    };

    for (const input of isfMetadata.inputs) {
      uniformLocations[input.name] = this.getUniformLocation(input.name);
    }

    this._isfMetadata = isfMetadata;
    this._attributeLocations = Object.freeze(attributeLocations);
    this._uniformLocations = Object.freeze(uniformLocations);
  }
}
