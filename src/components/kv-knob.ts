import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import kvKnobCss from "./kv-knob.css?inline";

@customElement("kv-knob")
export class KvKnob extends LitElement {
  public static styles = css`${unsafeCSS(kvKnobCss)}`;

  @property({ attribute: "min", type: Number })
  public min = 0.0;

  @property({ attribute: "max", type: Number })
  public max = 1.0;

  @property({ attribute: "value", type: Number })
  public value = 0.5;

  private _changeStartValue = this.value;
  private _changeStartCursorPositionY = 0;

  protected override render() {
    const progress = (this.value - this.min) / (this.max - this.min);

    return html`
      <div
        class="container"
        style=${"--progress: " + progress.toString()}
        @mousedown=${this.handleMouseDown}
      >
        <div class="indicator-track"></div>
        <div class="indicator-progress"></div>
        <div class="knob-body"></div>
        <div class="knob-pointer"></div>
      </div>
    `;
  }

  private handleMouseDown = (e: MouseEvent) => {
    this._changeStartValue = this.value;
    this._changeStartCursorPositionY = e.clientY;

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("mouseup", this.handleMouseUp, {
      once: true,
    });
  };

  private handleMouseMove = (e: MouseEvent) => {
    const changeStartValue = this._changeStartValue;
    const changeStartCursorPositionY = this._changeStartCursorPositionY;

    this.value = Math.max(
      this.min,
      Math.min(this.max, changeStartValue + (this.max - this.min) * (changeStartCursorPositionY - e.clientY) * 0.005),
    );
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
    "kv-knob": KvKnob;
  }
}
