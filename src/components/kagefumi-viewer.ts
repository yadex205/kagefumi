import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

import type { KagefumiCanvas } from "./kagefumi-canvas";

import sampleIsfSource from "./sample-isf.fs?raw";

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
