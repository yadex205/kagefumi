import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import { Kagefumi } from "kagefumi";

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
      "NAME": "level",
      "TYPE": "float",
      "DEFAULT": 0.5,
      "MIN": 0.0,
      "MAX": 1.0
    },
    {
      "NAME": "switch1",
      "TYPE": "bool",
      "DEFAULT": 0.0
    },
    {
      "NAME": "switch2",
      "TYPE": "long",
      "DEFAULT": 0,
      "MIN": 0,
      "MAX": 2
    },
    {
      "NAME": "color",
      "TYPE": "color",
      "DEFAULT": [0.5, 0.5, 0.5, 1.0]
    }
  ]
}*/

void main() {
  if (switch1 == false) {
    gl_FragColor = vec4(color.rgb * level, 1.0);
  } else if (switch2 == 0) {
    gl_FragColor = vec4(color.r * level, color.gb, 1.0);
  } else if (switch2 == 1) {
    gl_FragColor = vec4(color.r, color.g * level, color.b, 1.0);
  } else if (switch2 == 2) {
    gl_FragColor = vec4(color.rg, color.b * level, 1.0);
  }
}
`.trim();

@customElement("kagefumi-viewer")
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
    kagefumi.setIsfProgram(basicIsfSource);
    kagefumi.setInputValue("level", [1.0]);
    kagefumi.setInputValue("color", [0.9, 0.5, 0.5, 1.0]);
    kagefumi.setInputValue("switch1", [1]);
    kagefumi.setInputValue("switch2", [2]);

    kagefumi.start();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-canvas": KagefumiCanvas;
  }
}
