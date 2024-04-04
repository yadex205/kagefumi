import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Kagefumi } from "kagefumi";

import kaIsfCanvasCss from "./ka-isf-canvas.css?inline";

@customElement("ka-isf-canvas")
export class KaIsfCanvas extends LitElement {
  @property({ type: Number })
  public width = 640;

  @property({ type: Number })
  public height = 360;

  public static styles = unsafeCSS(kaIsfCanvasCss);

  private _canvasEl: HTMLCanvasElement;
  private _kagefumi: Kagefumi;

  private constructor() {
    super();

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "isf-canvas";

    const glContext = canvasEl.getContext("webgl");
    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const kagefumi = new Kagefumi(glContext);

    this._canvasEl = canvasEl;
    this._kagefumi = kagefumi;
  }

  public setIsfProgram = (isfSource: string) => {
    const kagefumi = this._kagefumi;

    kagefumi.setIsfProgram(isfSource);
    kagefumi.resetInputValues();
  };

  public setInputValue = (name: string, value: number[]) => {
    const kagefumi = this._kagefumi;

    kagefumi.setInputValue(name, value);
  };

  protected override render() {
    return html`
      ${this._canvasEl}
    `;
  }

  public override connectedCallback() {
    super.connectedCallback();

    const kagefumi = this._kagefumi;
    kagefumi.start();
  }

  protected override updated() {
    const kagefumi = this._kagefumi;

    kagefumi.setRenderSize(this.width, this.height);
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();

    const kagefumi = this._kagefumi;
    kagefumi.stop();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ka-isf-canvas": KaIsfCanvas;
  }
}
