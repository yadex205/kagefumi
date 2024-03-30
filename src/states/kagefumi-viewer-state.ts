import { action, observable } from "mobx";

import { RenderViewState } from "./render-view-state";

export class KagefumiViewerState {
  @observable
  public renderViews: RenderViewState[] = [];

  @observable
  public activeRenderViewUuid?: string;

  @action
  public addRenderView(label = "no name") {
    const renderView = new RenderViewState(crypto.randomUUID(), label);
    this.renderViews = [...this.renderViews, renderView];
  }
}
