import { LitElement, html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import { rgbaToHex, hexToRgba } from "@uiw/color-convert";

import { parseIsfMetadata, type IsfInput } from "@kagefumi/kage";
import { KaColorWheelElement, KaKnobElement } from "@kagefumi/ui";

import "./kf-isf-canvas";
import "./kf-isf-input-slot";
import type { KfIsfCanvasElement } from "./kf-isf-canvas";

import kfKagefumiCss from "./kf-kagefumi.css?inline";

@customElement("kf-kagefumi")
export class KfKagefumiElement extends LitElement {
  private _isfCanvasEl: KfIsfCanvasElement;
  private _isfInputs: IsfInput[] = [];

  static styles = unsafeCSS(kfKagefumiCss);

  @state()
  public isfSource = "";

  private constructor() {
    super();

    const isfCanvasEl = document.createElement("kf-isf-canvas");
    isfCanvasEl.className = "render-view-panel__canvas";
    isfCanvasEl.width = 1920;
    isfCanvasEl.height = 1080;

    this._isfCanvasEl = isfCanvasEl;
  }

  protected render() {
    return html`
      <div class="root">
        <div class="render-view-panel">
          ${this._isfCanvasEl}
        </div>
        <div class="isf-input-slots-panel">
          <div class="isf-input-slots">
            ${map(this._isfInputs, this.renderIsfInputSlot)}
          </div>
        </div>
      </div>
    `;
  }

  private renderIsfInputSlot = (isfInput: IsfInput) => {
    const isfInputSlotHtml = (strings: TemplateStringsArray, ...values: unknown[]) => {
      return html`
        <kf-isf-input-slot label=${isfInput.label || isfInput.name}>
          ${html(strings, ...values)}
        </kf-isf-input-slot>
      `;
    };

    if (isfInput.type === "bool") {
      return isfInputSlotHtml`
        <input type="checkbox" name=${isfInput.name} ?checked=${isfInput.default !== 0} @input=${this.handleBoolInput} />
      `;
    } else if (isfInput.type === "long") {
      const optionsHtml = isfInput.labels?.map(
        (label, index) => html`<option value=${index} ?selected=${isfInput.default === index}>${label}</option>`,
      );

      return isfInputSlotHtml`
        <select
          name=${isfInput.name}
          data-isf-input-type="long"
          @input=${this.handleLongInput}
        >
          ${optionsHtml}
        </select>
      `;
    } else if (isfInput.type === "float") {
      return isfInputSlotHtml`
        <ka-knob name=${isfInput.name} value=${isfInput.default} min=${isfInput.min} max=${isfInput.max} @input=${this.handleFloatInput}></ka-knob>
      `;
    } else if (isfInput.type === "color") {
      const value = isfInput.default ?? [1.0, 1.0, 1.0, 1.0];
      const hex = rgbaToHex({
        r: value[0] * 255,
        g: value[1] * 255,
        b: value[2] * 255,
        a: value[3] * 100,
      });

      return isfInputSlotHtml`
        <ka-color-wheel
          name=${isfInput.name}
          value=${hex}
          @input=${this.handleColorInput}
        ></ka-color-wheel>
      `;
    } else {
      return isfInputSlotHtml`unknown`;
    }
  };

  private handleBoolInput = (e: InputEvent) => {
    const isfCanvasEl = this._isfCanvasEl;
    const { name, checked } = e.target as HTMLInputElement;

    if (name) {
      isfCanvasEl.setInputValue(name, checked ? [1] : [0]);
    }
  };

  private handleLongInput = (e: InputEvent) => {
    const isfCanvasEl = this._isfCanvasEl;
    const { name, value } = e.target as HTMLSelectElement;

    if (name) {
      isfCanvasEl.setInputValue(name, [Number.parseInt(value)]);
    }
  };

  private handleFloatInput = (e: InputEvent) => {
    const isfCanvasEl = this._isfCanvasEl;
    const { name, value } = e.target as KaKnobElement;

    if (name) {
      isfCanvasEl.setInputValue(name, [value]);
    }
  };

  private handleColorInput = (e: InputEvent) => {
    const isfCanvasEl = this._isfCanvasEl;
    const { name, value } = e.target as KaColorWheelElement;

    if (name) {
      const rgba = hexToRgba(value);
      console.log(rgba);
      isfCanvasEl.setInputValue(name, [rgba.r / 255, rgba.g / 255, rgba.b / 255, rgba.a]);
    }
  };

  protected override willUpdate() {
    const isfCanvasEl = this._isfCanvasEl;
    const isfSource = this.isfSource;

    try {
      isfCanvasEl.setIsfProgram(isfSource);
      this._isfInputs = parseIsfMetadata(isfSource).inputs;
    } catch (e) {
      console.error(e);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kf-kagefumi": KfKagefumiElement;
  }
}
