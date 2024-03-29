import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import { Kagefumi } from "kagefumi";

@customElement("kagefumi-canvas")
export class KagefumiCanvas extends LitElement {
  private _kagefumi?: Kagefumi;
  private _canvasElRef: Ref<HTMLCanvasElement> = createRef();

  static styles = css`
    :host {
      display: block;
    }

    .canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  public async getKagefumi() {
    await this.updateComplete;

    const kagefumi = this._kagefumi;

    if (!kagefumi) {
      throw new Error("Cannot get Kagefumi instance.");
    }

    return kagefumi;
  }

  render() {
    return html`
      <canvas ${ref(this._canvasElRef)} class="canvas"></canvas>
    `;
  }

  firstUpdated() {
    const glContext = this._canvasElRef.value?.getContext("webgl");
    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const kagefumi = new Kagefumi(glContext);
    kagefumi.start();

    this._kagefumi = kagefumi;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-canvas": KagefumiCanvas;
  }
}
