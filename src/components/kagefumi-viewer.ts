import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

import Split from "split.js";

import { Kagefumi } from "kagefumi";

import kagefumiViewerCss from "./kagefumi-viewer.css?inline";
import sampleIsfSource from "../sample-isf.fs?raw";

@customElement("kagefumi-viewer")
class KagefumiViewer extends LitElement {
  private _leftSidePanelGroupElRef = createRef<HTMLDivElement>();
  private _mainPanelGroupElRef = createRef<HTMLDivElement>();
  private _renderViewPanelEl = createRef<HTMLDivElement>();
  private _inputsPanelEl = createRef<HTMLDivElement>();
  private _canvasElRef = createRef<HTMLCanvasElement>();
  private _kagefumi?: Kagefumi;

  static styles = css`${unsafeCSS(kagefumiViewerCss)}`;

  render() {
    return html`
      <div class="panels-group-container">
        <div ${ref(this._leftSidePanelGroupElRef)} class="left-side-panel-group">
          <kagefumi-viewer-tabs class="tabs" />
        </div>
        <div ${ref(this._mainPanelGroupElRef)} class="main-panel-group">
          <div ${ref(this._renderViewPanelEl)} class="render-view-panel">
            <canvas ${ref(this._canvasElRef)} class="render-view-panel__canvas" />
          </div>
          <div ${ref(this._inputsPanelEl)} class="inputs-panel">
            inputs
          </div>
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    const leftSidePanelGroupEl = this._leftSidePanelGroupElRef.value;
    const mainPanelGroupEl = this._mainPanelGroupElRef.value;
    const renderViewPanelEl = this._renderViewPanelEl.value;
    const inputsPanelEl = this._inputsPanelEl.value;
    const canvasEl = this._canvasElRef.value;

    if (!leftSidePanelGroupEl || !mainPanelGroupEl || !renderViewPanelEl || !inputsPanelEl || !canvasEl) {
      throw new Error("HTML is broken!");
    }

    Split([leftSidePanelGroupEl, mainPanelGroupEl], {
      sizes: [20, 80],
      minSize: [240, 720],
      gutter: () => {
        const gutterEl = document.createElement("gutter");
        gutterEl.className = "panels-group-gutter";
        return gutterEl;
      },
    });

    Split([renderViewPanelEl, inputsPanelEl], {
      direction: "vertical",
    });

    const glContext = canvasEl.getContext("webgl");

    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const kagefumi = new Kagefumi(glContext);
    kagefumi.start();

    kagefumi.setIsfProgram(sampleIsfSource);
    kagefumi.setInputValue("level", [1.0]);
    kagefumi.setInputValue("color", [0.9, 0.5, 0.5, 1.0]);
    kagefumi.setInputValue("switch1", [1]);
    kagefumi.setInputValue("switch2", [2]);

    this._kagefumi = kagefumi;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-viewer": KagefumiViewer;
  }
}
