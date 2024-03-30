import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";

import { Sortable } from "@shopify/draggable";

import kagefumiViewerTabsCss from "./kagefumi-viewer-tabs.css?inline";

@customElement("kagefumi-viewer-tabs")
class KagefumiViewerTabs extends LitElement {
  static styles = css`${unsafeCSS(kagefumiViewerTabsCss)}`;

  render() {
    return html`
      <ul class="tabs">
        <li class="tab">
          <div class="tab__label">sample-isf.fs</div>
        </li>
        <li class="tab">
          <div class="tab__label">sample-isf.fs</div>
        </li>
        <li class="tab tab--active">
          <div class="tab__label">sample-isf.fs</div>
        </li>
        <li class="tab">
          <div class="tab__label">sample-isf.fs</div>
        </li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-viewer-tabs": KagefumiViewerTabs;
  }
}
