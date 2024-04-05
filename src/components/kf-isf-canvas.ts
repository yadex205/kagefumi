import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Isf } from "@kagefumi/kage";

import kfIsfCanvasCss from "./kf-isf-canvas.css?inline";

@customElement("kf-isf-canvas")
export class KfIsfCanvasElement extends LitElement {
  @property({ type: Number })
  public width = 640;

  @property({ type: Number })
  public height = 360;

  public static styles = unsafeCSS(kfIsfCanvasCss);

  private _canvasEl: HTMLCanvasElement;
  private _isf: Isf;

  private constructor() {
    super();

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "isf-canvas";

    const glContext = canvasEl.getContext("webgl");
    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const isf = new Isf(glContext);

    this._canvasEl = canvasEl;
    this._isf = isf;
  }

  public setIsfProgram = (isfSource: string) => {
    const isf = this._isf;

    isf.setIsfProgram(isfSource);
    isf.resetInputValues();
  };

  public setInputValue = (name: string, value: number[]) => {
    const isf = this._isf;

    isf.setInputValue(name, value);
  };

  protected override render() {
    return html`
      ${this._canvasEl}
    `;
  }

  public override connectedCallback() {
    super.connectedCallback();

    const isf = this._isf;
    isf.start();
  }

  protected override updated() {
    const isf = this._isf;

    isf.setRenderSize(this.width, this.height);
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();

    const isf = this._isf;
    isf.stop();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kf-isf-canvas": KfIsfCanvasElement;
  }
}
