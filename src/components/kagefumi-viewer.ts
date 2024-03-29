import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

import type { KagefumiCanvas } from "./kagefumi-canvas";

const sampleIsfSource = `
/*{
  "DESCRIPTION": "Sample ISF program",
  "CREDIT": "Kanon Kakuno",
  "ISFVSN": "2.0",
  "VSN": "1.0.0",
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
`;

@customElement("kagefumi-viewer")
class KagefumiViewer extends LitElement {
  private _kagefumiCanvasElRef = createRef<KagefumiCanvas>();

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div>
        <kagefumi-canvas ${ref(this._kagefumiCanvasElRef)}></kagefumi-canvas>
      </div>
    `;
  }

  async firstUpdated() {
    const kagefumiCanvasEl = this._kagefumiCanvasElRef.value;

    if (!kagefumiCanvasEl) {
      throw new Error("Cannot find <kagefumi-canvas />.");
    }

    const kagefumi = await kagefumiCanvasEl.getKagefumi();
    kagefumi.setIsfProgram(sampleIsfSource);
    kagefumi.setInputValue("level", [1.0]);
    kagefumi.setInputValue("color", [0.9, 0.5, 0.5, 1.0]);
    kagefumi.setInputValue("switch1", [1]);
    kagefumi.setInputValue("switch2", [2]);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-viewer": KagefumiViewer;
  }
}
