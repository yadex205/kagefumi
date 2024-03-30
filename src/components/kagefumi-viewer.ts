import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { createRef, ref } from "lit/directives/ref.js";

import Split from "split.js";

import { Kagefumi, IsfInput } from "kagefumi";

import kagefumiViewerCss from "./kagefumi-viewer.css?inline";

@customElement("kagefumi-viewer")
export class KagefumiViewer extends LitElement {
  private _navigationPanelGroupElRef = createRef<HTMLDivElement>();
  private _mainPanelGroupElRef = createRef<HTMLDivElement>();
  private _renderViewPanelEl = createRef<HTMLDivElement>();
  private _inputsPanelEl = createRef<HTMLDivElement>();
  private _canvasEl: HTMLCanvasElement;
  private _kagefumi: Kagefumi;

  static styles = css`${unsafeCSS(kagefumiViewerCss)}`;

  @state()
  private _isfSources: { uuid: string; name: string; isfSource: string }[] = [];

  @state()
  private _activeIsfSourceUuid?: string;

  private constructor() {
    super();

    const canvasEl = document.createElement("canvas");
    canvasEl.className = "render-view-panel__canvas";

    const glContext = canvasEl.getContext("webgl");
    if (!glContext) {
      throw new Error("Cannot get WebGL context.");
    }

    const kagefumi = new Kagefumi(glContext);
    kagefumi.start();

    this._canvasEl = canvasEl;
    this._kagefumi = kagefumi;
  }

  protected render() {
    return html`
      <div class="root">
        <div ${ref(this._navigationPanelGroupElRef)} class="navigation-panel-group">
          <ul class="tabs">
            ${map(this._isfSources, this.renderTab.bind(this))}
          </ul>
          <kagefumi-viewer-tabs class="tabs" />
        </div>
        <div ${ref(this._mainPanelGroupElRef)} class="main-panel-group">
          <div ${ref(this._renderViewPanelEl)} class="render-view-panel">
            ${this._canvasEl}
          </div>
          <div ${ref(this._inputsPanelEl)} class="isf-input-slots-panel">
            <ul class="isf-input-slots">
              ${map(this._kagefumi.isfInputs, this.renderIsfInputSlot.bind(this))}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  private renderTab(isfSource: { uuid: string; name: string }) {
    return html`
      <li
        class="tab ${this._activeIsfSourceUuid === isfSource.uuid ? "tab--active" : ""}"
        @click=${() => (this._activeIsfSourceUuid = isfSource.uuid)}
      >
        <div class="tab__label">${isfSource.name}</div>
      </li>
    `;
  }

  private renderIsfInputSlot(isfInput: IsfInput) {
    const isfInputSlotHtml = (strings: TemplateStringsArray, ...values: unknown[]) => {
      const inputChunkInnerHtml = html(strings, ...values);

      return html`
        <li class="isf-input-slot isf-input-slot--${isfInput.type}">
          <div class="isf-input-slot__label">${isfInput.label || isfInput.name}</div>
          <div class="isf-input-slot__input-chunk">${inputChunkInnerHtml}</div>
        </li>
      `;
    };

    if (isfInput.type === "bool") {
      return isfInputSlotHtml`
        <input type="checkbox"
               name=${isfInput.name}
               data-isf-input-type="bool"
               ?checked=${isfInput.default !== 0}
               @change=${this.handleIsfInputChange.bind(this)}
        />
      `;
    } else if (isfInput.type === "long") {
      const optionsHtml = isfInput.labels?.map(
        (label, index) => html`<option value=${index} ?selected=${isfInput.default === index}>${label}</option>`,
      );

      return isfInputSlotHtml`
        <select
          name=${isfInput.name}
          data-isf-input-type="long"
          @change=${this.handleIsfInputChange.bind(this)}
        >
          ${optionsHtml}
        </select>
      `;
    } else if (isfInput.type === "float") {
      return isfInputSlotHtml`
        <input type="range"
               data-isf-input-type="float"
               name=${isfInput.name}
               step="0.01"
               min=${isfInput.min}
               max=${isfInput.max}
               value=${isfInput.default}
               @input=${this.handleIsfInputChange.bind(this)}
        />
      `;
    } else {
      return isfInputSlotHtml`unknown`;
    }
  }

  handleIsfInputChange(e: InputEvent) {
    const kagefumi = this._kagefumi;
    const inputEl = e.target as HTMLElement;
    const isfInputType = inputEl.dataset.isfInputType;

    if (isfInputType === "bool") {
      const { name, checked } = inputEl as HTMLInputElement;
      kagefumi.setInputValue(name, checked ? [1] : [0]);
    } else if (isfInputType === "long") {
      const { name, value } = inputEl as HTMLSelectElement;
      kagefumi.setInputValue(name, [Number.parseInt(value)]);
    } else if (isfInputType === "float") {
      const { name, valueAsNumber } = inputEl as HTMLInputElement;
      kagefumi.setInputValue(name, [valueAsNumber]);
    }
  }

  public async addIsfSource(name: string, isfSource: string) {
    const newIsfSourceUuid = crypto.randomUUID();

    this._isfSources = [...this._isfSources, { uuid: newIsfSourceUuid, name, isfSource }];
    this._activeIsfSourceUuid = newIsfSourceUuid;

    await this.updateComplete;
  }

  protected willUpdate() {
    const kagefumi = this._kagefumi;
    const isfSources = this._isfSources;
    const activeIsfSourceUuid = this._activeIsfSourceUuid;

    for (const { uuid, isfSource } of isfSources) {
      if (uuid === activeIsfSourceUuid) {
        try {
          kagefumi.setIsfProgram(isfSource);
        } catch (e) {
          console.error(e);
        } finally {
          break;
        }
      }
    }
  }

  protected firstUpdated() {
    const navigationPanelGroupEl = this._navigationPanelGroupElRef.value;
    const mainPanelGroupEl = this._mainPanelGroupElRef.value;
    const renderViewPanelEl = this._renderViewPanelEl.value;
    const inputsPanelEl = this._inputsPanelEl.value;
    if (!navigationPanelGroupEl || !mainPanelGroupEl || !renderViewPanelEl || !inputsPanelEl) {
      throw new Error("HTML is broken!");
    }

    Split([navigationPanelGroupEl, mainPanelGroupEl], {
      sizes: [20, 80],
      gutter: () => {
        const gutterEl = document.createElement("div");
        gutterEl.className = "navigation-panel-group-resizer";
        return gutterEl;
      },
    });

    Split([renderViewPanelEl, inputsPanelEl], {
      direction: "vertical",
      sizes: [70, 30],
      gutter: () => {
        const gutterEl = document.createElement("gutter");
        gutterEl.className = "main-panel-group__gutter";
        return gutterEl;
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kagefumi-viewer": KagefumiViewer;
  }
}
