import { action, observable } from "mobx";

export class RenderViewState {
  private _uuid: string;

  @observable
  public label: string;

  @observable
  public isfFilePath?: string;

  @observable
  public isfFileContent?: string;

  public constructor(uuid: string, label: string) {
    this._uuid = uuid;
    this.label = label;
  }

  public get uuid() {
    return this._uuid;
  }

  @action
  public setLabel(label: string) {
    this.label = label;
  }

  @action
  public setIsfFile(filePath: string, fileContent: string) {
    this.isfFilePath = filePath;
    this.isfFileContent = fileContent;
  }
}
