import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { hsvaToRgba } from "@uiw/color-convert";

import kaColorWheelCss from "./ka-color-wheel.css?inline";

@customElement("ka-color-wheel")
export class KaColorWheel extends LitElement {
  public static styles = unsafeCSS(kaColorWheelCss);

  @property()
  public value = "#ffffff";

  private _colorWheelCanvasEl: HTMLCanvasElement;

  public constructor() {
    super();

    const colorWheelCanvasEl = document.createElement("canvas");
    colorWheelCanvasEl.className = "color-wheel";
    colorWheelCanvasEl.width = 512;
    colorWheelCanvasEl.height = 512;
    this._colorWheelCanvasEl = colorWheelCanvasEl;
  }

  protected override render() {
    return html`
      <div class="root">
        ${this._colorWheelCanvasEl}
        <div class="pointer"></div>
      </div>
    `;
  }

  public override connectedCallback() {
    super.connectedCallback();

    this.updateColorWheel();
  }

  private async updateColorWheel() {
    const ctx = this._colorWheelCanvasEl.getContext("bitmaprenderer");
    if (!ctx) {
      throw new Error("Cannot get bitmaprenderer context.");
    }

    const imageData = new ImageData(ctx.canvas.width, ctx.canvas.height);
    const centerX = (imageData.width - 1) / 2;
    const centerY = (imageData.height - 1) / 2;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const startIndex = (y * imageData.width + x) * 4;
        const hue = (Math.atan2(y - centerY, x - centerX) / (2 * Math.PI) + 0.5) * 360 + 90;
        const saturate =
          (Math.sqrt(Math.pow(y - centerY, 2) + Math.pow(x - centerX, 2)) /
            Math.min(imageData.width / 2, imageData.height / 2)) *
          100;

        const rgb = hsvaToRgba({
          h: hue,
          s: saturate,
          v: 100,
          a: 1,
        });

        imageData.data[startIndex + 0] = rgb.r;
        imageData.data[startIndex + 1] = rgb.g;
        imageData.data[startIndex + 2] = rgb.b;
        imageData.data[startIndex + 3] = 255;
      }
    }

    const imageBitMap = await createImageBitmap(imageData);
    ctx.transferFromImageBitmap(imageBitMap);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ka-color-wheel": KaColorWheel;
  }
}
