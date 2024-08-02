import ComponentBase from "./componentBase";

abstract class DIVComponentBase extends ComponentBase {
  mainDIV: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.mainDIV = null;
  }

  protected initProperty(): void {
    super.initProperty();
  }
}

export default DIVComponentBase;
