import { ComponentProperty } from "lib/types/property";
import DIVComponentBase from "./divComponentBase";

class MapWidget extends DIVComponentBase {
  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);

    try {
      window.initAPIPromise.then(() => {
        this.syncModule.initEventSync();
      });
    } catch (e) {}
  }

  /**
   * @description 初始化组件属性列表和属性字典
   */
  protected initProperty() {
    super.initProperty();
    const property: ComponentProperty = {
      basic: {
        type: "map",
      },
    };
    this.addProperty(property, []);
  }

  protected draw() {
    super.draw();
    this._generateBasicDIV();
  }

  _generateBasicDIV() {}

  update() {}
}

export default MapWidget;
