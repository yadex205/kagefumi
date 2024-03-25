import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";

import { Kagefumi } from "../lib/kagefumi";

const basicIsfSource = `
/*{
  "DESCRIPTION": "Minimum ISF shader.",
  "CREDIT": "Kanon Kakuno",
  "ISFVSN": "2.0",
  "CATEGORY": [
    "GENERATOR"
  ],
  "INPUTS": [
    {
      "NAME": "value1",
      "TYPE": "float",
      "DEFAULT": 0.5,
      "MIN": 0.0,
      "MAX": 1.0
    }
  ]
}*/

void main() {
  gl_FragColor = vec4(0.6, 0.6, 0.6, 1.0);
}
`.trim();

@customElement("kagefumi-canvas")
export class KagefumiCanvas extends LitElement {
  private _canvasElRef: Ref<HTMLCanvasElement> = createRef();

  static styles = css`
    :host {
      display: block;
    }

    .canvas {
      display: block;
      width: 960px;
      height: 540px;
    }
  `;

  render() {
    return html`
      <canvas ${ref(this._canvasElRef)} class="canvas"></canvas>
    `;
  }

  firstUpdated() {
    super.connectedCallback();

    const glContext = this._canvasElRef.value?.getContext("webgl");
    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const kagefumi = new Kagefumi(glContext);
    kagefumi.createIsfProgram("basic", basicIsfSource);
    kagefumi.useIsfProgram("basic");

    kagefumi.start();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-canvas": KagefumiCanvas;
  }
}
