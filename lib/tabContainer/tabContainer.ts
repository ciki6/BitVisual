import DIVContainerBase from "../base/divContainerBase";

class TabContainer extends DIVContainerBase {
  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.draw();
  }

  draw() {
    super.draw();
  }

  update() {}
}

export default TabContainer;
