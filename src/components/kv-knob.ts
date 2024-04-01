import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import kvKnobCss from "./kv-knob.css?inline";

@customElement("kv-knob")
export class KvKnob extends LitElement {
  public static styles = css`${unsafeCSS(kvKnobCss)}`;

  protected override render() {
    return html`
      <div class="container">
        <div class="indicator-track"></div>
        <div class="indicator-progress"></div>
        <div class="knob-body"></div>
        <div class="knob-pointer"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kv-knob": KvKnob;
  }
}
