import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import kfIsfInputSlotCss from "./kf-isf-input-slot.css?inline";

@customElement("kf-isf-input-slot")
export class KfIsfInputSlotElement extends LitElement {
  public static styles = unsafeCSS(kfIsfInputSlotCss);

  @property()
  public label?: string;

  protected override render() {
    return html`
      <div class="root">
        <div class="label">${this.label}</div>
        <div class="input-chunk"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kf-isf-input-slot": KfIsfInputSlotElement;
  }
}
