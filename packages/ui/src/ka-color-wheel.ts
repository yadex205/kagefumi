import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { hexToHsva, hsvaToRgba, hsvaToHex } from "@uiw/color-convert";

import { isLeftClick } from "./utils";

import kaColorWheelCss from "./ka-color-wheel.css?inline";

@customElement("ka-color-wheel")
export class KaColorWheelElement extends LitElement {
  public static styles = unsafeCSS(kaColorWheelCss);

  @property()
  public value = "#ffffff";

  private _colorWheelCanvasEl: HTMLCanvasElement;
  private _changeStartValue = this.value;

  public constructor() {
    super();

    const colorWheelCanvasEl = document.createElement("canvas");
    colorWheelCanvasEl.className = "color-wheel";
    colorWheelCanvasEl.width = 64;
    colorWheelCanvasEl.height = 64;
    this._colorWheelCanvasEl = colorWheelCanvasEl;
  }

  protected override render() {
    const hslColor = hexToHsva(this.value);
    return html`
      <style>
        :host {
          --hue: ${hslColor.h}deg;
          --saturate: ${hslColor.s}%;
          --rgb: ${this.value};
        }
      </style>
      <div class="root" @mousedown=${this.handleMouseDown}>
        ${this._colorWheelCanvasEl}
        <div class="pointer-container">
          <div class="pointer"></div>
        </div>
      </div>
    `;
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (!isLeftClick(e)) {
      return;
    }

    this._changeStartValue = this.value;

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("mouseup", this.handleMouseUp, { once: true });

    this.handleMouseMove(e);
  };

  private handleMouseMove = (e: MouseEvent) => {
    const clientRect = this._colorWheelCanvasEl.getClientRects()[0];
    const deltaX = e.clientX - (clientRect.x + clientRect.width / 2);
    const deltaY = clientRect.y + clientRect.width / 2 - e.clientY;

    const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    const maxDistance = Math.min(clientRect.width, clientRect.height) / 2;

    const hue = (Math.atan2(deltaY, deltaX) / (2 * Math.PI) + 0.5) * 360 + 180;
    const saturate = Math.max(0, Math.min(100, (distance / maxDistance) * 100));
    const brightness = 100;

    this.value = hsvaToHex({ h: hue, s: saturate, v: brightness, a: 1 });
    this.dispatchInputEvent();
  };

  private handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.dispatchChangeEvent();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("mouseup", this.handleMouseUp);

      this.value = this._changeStartValue;
      this.dispatchInputEvent();
      this.dispatchChangeEvent();
    }
  };

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
        const hue = (Math.atan2(x - centerX, y - centerY) / (2 * Math.PI) + 0.5) * 360 + 90;
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

  private dispatchInputEvent = () => {
    const event = new Event("input");
    this.dispatchEvent(event);
  };

  private dispatchChangeEvent = () => {
    const event = new Event("change");
    this.dispatchEvent(event);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ka-color-wheel": KaColorWheelElement;
  }
}
